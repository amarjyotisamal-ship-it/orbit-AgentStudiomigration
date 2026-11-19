export function average(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, n) => acc + (Number(n) || 0), 0);
  return Math.round((sum / numbers.length) * 100) / 100;
}
export function percentile95(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = Math.ceil(0.95 * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}
