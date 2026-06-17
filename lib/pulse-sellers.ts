const DARDOC_SELLER_IDS = new Set(["seller_655656ac86b8", "SELLER_dardoc"]);

export function isDardocPulseSeller(sellerId: string | null | undefined) {
  const normalized = String(sellerId ?? "").trim();
  return DARDOC_SELLER_IDS.has(normalized);
}
