// Utility to compute discount percentage from price and offerPrice
// Returns integer percentage (rounded), or 0 if no valid discount
export function calculateDiscountPercent(price, offerPrice) {
  const p = Number(price);
  const o = Number(offerPrice);
  if (!isFinite(p) || p <= 0) return 0;
  if (!isFinite(o) || o <= 0) return 0;
  if (o >= p) return 0;
  const pct = Math.round(((p - o) / p) * 100);
  return pct > 0 ? pct : 0;
}