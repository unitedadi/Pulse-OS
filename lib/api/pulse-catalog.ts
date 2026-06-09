import { appendPulseAccountId } from "@/lib/pulse-account-selector";

export type PulseVerticalId = "iv-drips" | "laboratory" | "peptides";

export type PulseVerticalOption = {
  id: PulseVerticalId;
  title: string;
  description: string;
  productCount: number;
};

export type PulseCatalogProduct = {
  id: string;
  verticalId: PulseVerticalId;
  name: string;
  description: string;
  subtitle?: string;
  price: number;
  duration: string;
  category: string;
  image: string;
  highlights?: string[];
  ingredients?: Array<{ title: string; detail?: string }>;
  biomarkers?: string[];
  recommendedUse?: string;
  safety?: string;
  prepare?: string;
  categoryTags?: string[];
  specs?: Array<{ label: string; value: string }>;
  fullSpecs?: Array<{ label: string; value: string }>;
  howItWorks?: string;
  clinical?: Array<{ label: string; value: string }>;
  safetyDisclaimer?: string;
  rating?: { stars: number; reviewCount?: number };
  faqs?: Array<{ question: string; answer: string }>;
  ctaBanner?: { title: string; subtitle?: string; cta?: string };
  bundleOffers?: Array<{ label: string; price: number }>;
};

type CatalogResponse = {
  products?: Array<{
    product_uuid?: string;
    default_name?: string | null;
    seller_display_name?: string | null;
    seller_price_aed_fils?: number | null;
    seller_offer?: {
      display_name?: string | null;
      price_aed_fils?: number | null;
    } | null;
    product_type?: string | null;
    category?: string | null;
    biomarkers?: string[] | null;
    attributes_json?: unknown;
    bundle_offers?: unknown;
  }>;
  total_count?: number | null;
};

type VerticalDefinition = {
  id: PulseVerticalId;
  title: string;
  description: string;
  path: string;
  category: string;
  duration: string;
  image: string;
};

const VERTICALS: VerticalDefinition[] = [
  {
    id: "iv-drips",
    title: "IV Drips",
    description: "At-home vitamin infusions and wellness drips.",
    path: "/verticals/iv-drips/products?product_type=PACKAGE",
    category: "IV Drips",
    duration: "45-90 min",
    image: "/services/iv-drip.svg",
  },
  {
    id: "laboratory",
    title: "Labs",
    description: "Home sample collection for diagnostic packages.",
    path: "/verticals/laboratory/products?product_type=PACKAGE",
    category: "Laboratory",
    duration: "Home collection",
    image: "/services/skin-therapy.png",
  },
  {
    id: "peptides",
    title: "Peptides",
    description: "Peptide protocol products fulfilled through DarDoc Rx.",
    path: "/verticals/shipments/products?category=PEPTIDE",
    category: "Peptides",
    duration: "Delivery",
    image: "/services/skin-therapy.png",
  },
];

function backendPath(path: string, params: Record<string, string | number>) {
  const [pathname, query = ""] = path.split("?");
  const search = new URLSearchParams(query);
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  return `/api/backend${pathname}?${search.toString()}`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function recordFrom(value: unknown): Record<string, unknown> | null {
  const record = asRecord(value);
  if (record) return record;
  if (typeof value !== "string") return null;

  try {
    return asRecord(JSON.parse(value));
  } catch {
    return null;
  }
}

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return undefined;
}

function stringsFrom(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(/\n|;|\u2022/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      const record = asRecord(item);
      return (
        asString(record?.title) ||
        asString(record?.name) ||
        asString(record?.label) ||
        asString(record?.value)
      );
    })
    .filter((item): item is string => Boolean(item));
}

function ingredientsFrom(value: unknown): Array<{ title: string; detail?: string }> {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((title) => ({ title }));
  }

  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return { title: item.trim() };
      const record = asRecord(item);
      const title =
        asString(record?.title) ||
        asString(record?.name) ||
        asString(record?.ingredient) ||
        asString(record?.label);
      if (!title) return null;
      const detail =
        asString(record?.detail) ||
        asString(record?.description) ||
        asString(record?.dose) ||
        asString(record?.amount);
      return detail ? { title, detail } : { title };
    })
    .filter((item): item is { title: string; detail?: string } => Boolean(item));
}

function faqsFrom(value: unknown): Array<{ question: string; answer: string }> {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const record = asRecord(item);
      const question = asString(record?.question) || asString(record?.q);
      const answer = asString(record?.answer) || asString(record?.a);
      return question && answer ? { question, answer } : null;
    })
    .filter((item): item is { question: string; answer: string } => Boolean(item));
}

function specsFrom(value: unknown): Array<{ label: string; value: string }> {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const record = asRecord(item);
      const label = asString(record?.label) || asString(record?.title) || asString(record?.name);
      const specValue = asString(record?.value) || asString(record?.detail) || asString(record?.description);
      return label && specValue ? { label, value: specValue } : null;
    })
    .filter((item): item is { label: string; value: string } => Boolean(item));
}

function categoryTagsFrom(categories: unknown, metadata: unknown) {
  const metadataLabels = Array.isArray(metadata)
    ? metadata
        .map((item) => {
          const record = asRecord(item);
          return asString(record?.label) || asString(record?.name) || asString(record?.key);
        })
        .filter((item): item is string => Boolean(item))
    : [];

  return metadataLabels.length ? metadataLabels : stringsFrom(categories);
}

function ratingFrom(value: unknown) {
  const record = asRecord(value);
  const stars = asNumber(record?.stars);
  if (!stars) return undefined;
  return {
    stars,
    reviewCount: asNumber(record?.reviewCount) || asNumber(record?.review_count),
  };
}

function clinicalFrom(value: unknown): Array<{ label: string; value: string }> {
  const record = asRecord(value);
  if (!record) return [];

  const labels: Record<string, string> = {
    prescriptionRequired: "Prescription required",
    requiresPrescription: "Prescription required",
    physicianReviewRequired: "Physician review",
    requiresConsultation: "Consultation required",
    consultationIncluded: "Consultation included",
    coldChain: "Cold chain",
  };

  return Object.entries(record)
    .map(([key, value]) => {
      const label = labels[key] ?? key.replace(/[_-]/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");
      if (typeof value === "boolean") return { label, value: value ? "Yes" : "No" };
      const text = asString(value) || (typeof value === "number" ? String(value) : undefined);
      return text ? { label, value: text } : null;
    })
    .filter((item): item is { label: string; value: string } => Boolean(item));
}

function ctaBannerFrom(value: unknown) {
  const record = asRecord(value);
  const title = asString(record?.title);
  if (!title) return undefined;
  return {
    title,
    subtitle: asString(record?.subtitle),
    cta: asString(record?.cta),
  };
}

function bundleOffersFrom(value: unknown): Array<{ label: string; price: number }> {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const record = asRecord(item);
      const label =
        asString(record?.label) ||
        asString(record?.title) ||
        asString(record?.name) ||
        asString(record?.display_name);
      const priceFils =
        asNumber(record?.price_aed_fils) ||
        asNumber(record?.seller_price_aed_fils) ||
        asNumber(record?.price_fils);
      if (!label || !priceFils) return null;
      return { label, price: Math.round(priceFils / 100) };
    })
    .filter((item): item is { label: string; price: number } => Boolean(item));
}

function firstString(values: string[]) {
  return values.find(Boolean);
}

function imageFrom(attributes: Record<string, unknown>, fallback: string) {
  const directImage =
    asString(attributes.image_url) ||
    asString(attributes.image) ||
    asString(attributes.thumbnail_url);
  if (directImage) return directImage;

  const images = attributes.images;
  if (Array.isArray(images)) {
    for (const image of images) {
      const record = asRecord(image);
      const src =
        asString(record?.src) ||
        asString(record?.url) ||
        asString(record?.image_url) ||
        asString(image);
      if (src) return src;
    }
  }

  return fallback;
}

function ivImageFrom(iv: Record<string, unknown>, attributes: Record<string, unknown>, fallback: string) {
  return (
    asString(iv.image_url) ||
    asString(iv.imageUrl) ||
    asString(iv.image) ||
    asString(iv.thumbnail_url) ||
    asString(iv.thumbnailUrl) ||
    imageFrom(attributes, fallback)
  );
}

async function fetchCatalog(
  definition: VerticalDefinition,
  sellerId: string,
  limit: number,
  view: "basic" | "full" = "basic",
  accountId?: string | null
) {
  const response = await fetch(
    appendPulseAccountId(
      backendPath(definition.path, {
        seller_id: sellerId,
        view,
        limit,
        offset: 0,
      }),
      accountId
    ),
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const payload = (await response.json().catch(() => null)) as
    | (CatalogResponse & { error?: string })
    | null;

  if (!response.ok) {
    throw new Error(payload?.error || `catalog_${response.status}`);
  }

  return payload ?? {};
}

export async function fetchSellerVerticals(sellerId: string, accountId?: string | null) {
  const results = await Promise.allSettled(
    VERTICALS.map(async (definition) => {
      const payload = await fetchCatalog(definition, sellerId, 1, "basic", accountId);
      const productCount = Number(payload.total_count ?? payload.products?.length ?? 0);
      if (productCount <= 0) return null;
      return {
        id: definition.id,
        title: definition.title,
        description: definition.description,
        productCount,
      } satisfies PulseVerticalOption;
    })
  );

  return results
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((vertical): vertical is PulseVerticalOption => Boolean(vertical));
}

export async function fetchSellerProductsForVertical(
  sellerId: string,
  verticalId: PulseVerticalId,
  accountId?: string | null
) {
  const definition = VERTICALS.find((item) => item.id === verticalId);
  if (!definition) throw new Error("unsupported_vertical");

  const payload = await fetchCatalog(definition, sellerId, 60, "full", accountId);
  return (payload.products ?? [])
    .map((product): PulseCatalogProduct | null => {
      const id = String(product.product_uuid ?? "").trim();
      if (!id) return null;

      const attributes = recordFrom(product.attributes_json) ?? {};
      const sellerOffer = product.seller_offer ?? null;
      const name = String(
        product.seller_display_name ||
          sellerOffer?.display_name ||
          product.default_name ||
          id
      ).trim();
      const priceFils = Number(product.seller_price_aed_fils ?? sellerOffer?.price_aed_fils ?? 0);

      const iv = recordFrom(attributes.IV) ?? recordFrom(attributes.iv) ?? {};
      const lab = recordFrom(attributes.lab) ?? {};
      const peptide = recordFrom(attributes.peptide) ?? {};
      const preConsultation = recordFrom(peptide.pre_consultation) ?? {};

      const labBiomarkers = stringsFrom(lab.biomarkers ?? product.biomarkers);
      const peptideBenefits = stringsFrom(preConsultation.key_benefits ?? peptide.key_benefits);
      const peptideIndications = stringsFrom(peptide.indications);
      const ivIngredients = ingredientsFrom(
        iv.displayIngredients ?? iv.display_ingredients ?? attributes.displayIngredients ?? attributes.display_ingredients
      );
      const peptideSpecs = specsFrom(peptide.specs);
      const peptideFullSpecs = specsFrom(peptide.fullSpecs ?? peptide.full_specs);

      const description =
        verticalId === "laboratory"
          ? asString(lab.subtitle) ||
            asString(lab.tagline) ||
            asString(lab.description) ||
            (labBiomarkers.length ? `${labBiomarkers.length} biomarkers` : definition.description)
          : verticalId === "peptides"
          ? asString(peptide.tagline) || firstString(peptideIndications) || definition.description
          : asString(iv.description) || asString(attributes.description) || definition.description;

      const subtitle =
        verticalId === "laboratory"
          ? asString(lab.tagline) || asString(lab.description)
          : verticalId === "peptides"
          ? firstString(peptideIndications)
          : asString(iv.serviceTime) || asString(iv.service_time);

      const highlights =
        verticalId === "laboratory"
          ? stringsFrom(lab.goodFor ?? lab.good_for).slice(0, 6)
          : verticalId === "peptides"
          ? (peptideBenefits.length ? peptideBenefits : peptideIndications).slice(0, 6)
          : stringsFrom(iv.recommendedUse ?? iv.recommended_use ?? attributes.recommendedUse ?? attributes.recommended_use).slice(0, 4);

      return {
        id,
        verticalId,
        name,
        description,
        subtitle,
        price: Math.round(priceFils / 100),
        duration: definition.duration,
        category: definition.category,
        image:
          verticalId === "laboratory"
            ? asString(lab.image_url) || imageFrom(attributes, definition.image)
            : verticalId === "iv-drips"
            ? ivImageFrom(iv, attributes, definition.image)
            : imageFrom(attributes, definition.image),
        highlights,
        ingredients: ivIngredients,
        biomarkers: labBiomarkers,
        recommendedUse:
          asString(iv.recommendedUse) ||
          asString(iv.recommended_use) ||
          asString(attributes.recommendedUse) ||
          asString(attributes.recommended_use) ||
          asString(peptide.recommended_use),
        safety:
          asString(iv.safety) ||
          asString(attributes.safety) ||
          asString(peptide.safety) ||
          asString(peptide.important_safety_information),
        prepare: asString(lab.prepare_full) || asString(lab.prepare) || asString(lab.preparation),
        faqs: faqsFrom(lab.faqs ?? peptide.faqs ?? iv.faqs),
        bundleOffers: bundleOffersFrom(product.bundle_offers ?? attributes.bundle_offers),
        categoryTags: verticalId === "peptides" ? categoryTagsFrom(peptide.categories, peptide.categoryMetadata) : undefined,
        specs: verticalId === "peptides" ? peptideSpecs : undefined,
        fullSpecs: verticalId === "peptides" ? peptideFullSpecs : undefined,
        howItWorks: verticalId === "peptides" ? asString(peptide.howItWorks) || asString(peptide.how_it_works) : undefined,
        clinical: verticalId === "peptides" ? clinicalFrom(peptide.clinical) : undefined,
        safetyDisclaimer:
          verticalId === "peptides"
            ? asString(peptide.safetyDisclaimer) || asString(peptide.safety_disclaimer)
            : undefined,
        rating: verticalId === "peptides" ? ratingFrom(peptide.rating) : undefined,
        ctaBanner: verticalId === "peptides" ? ctaBannerFrom(peptide.ctaBanner ?? peptide.cta_banner) : undefined,
      };
    })
    .filter((product): product is PulseCatalogProduct => Boolean(product));
}
