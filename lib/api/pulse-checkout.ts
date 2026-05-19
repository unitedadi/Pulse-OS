import type { PulseCatalogProduct } from "./pulse-catalog";

type CreatePulseCheckoutIntentInput = {
  sellerId: string;
  customerId: string;
  products: PulseCatalogProduct[];
  returnUrl: string;
  cancelUrl: string;
};

type CheckoutIntentResponse = {
  checkout_intent_id: string;
  checkout_url: string;
  expires_at: string;
  status: string;
};

function cartForProducts(products: PulseCatalogProduct[]) {
  const firstProduct = products[0];

  if (firstProduct?.verticalId === "peptides") {
    return {
      items: products.map((product) => ({ product_id: product.id, qty: 1 })),
    };
  }

  return {
    items: products.map((product) => ({ kind: "PACKAGE", product_id: product.id, addons: [] })),
  };
}

export async function createPulseCheckoutIntent({
  sellerId,
  customerId,
  products,
  returnUrl,
  cancelUrl,
}: CreatePulseCheckoutIntentInput) {
  if (products.length === 0) throw new Error("checkout_cart_empty");

  const response = await fetch("/api/backend/checkout/intents", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      seller_id: sellerId,
      platform: "b2b",
      customer_id: customerId,
      cart: cartForProducts(products),
      return_url: returnUrl,
      cancel_url: cancelUrl,
      metadata: {
        source: "pulse_os",
        vertical_id: products[0]?.verticalId,
        product_ids: products.map((product) => product.id),
      },
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | (CheckoutIntentResponse & { error?: string; detail?: string })
    | null;

  if (!response.ok) {
    throw new Error(payload?.error || payload?.detail || `checkout_intent_${response.status}`);
  }

  if (!payload?.checkout_url) {
    throw new Error("checkout_url_missing");
  }

  return payload;
}
