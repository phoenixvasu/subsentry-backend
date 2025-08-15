export function clampLimit(limit, min = 5, max = 50) {
  const n = Number(limit) || min;
  return Math.max(min, Math.min(max, n));
}

export function pageToOffset(page, limit) {
  const p = Number(page) > 1 ? Number(page) : 1;
  return (p - 1) * limit;
}
