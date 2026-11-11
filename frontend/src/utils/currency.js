export function formatMWK(amount) {
  const n = Number(amount || 0);
  return `MK ${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}