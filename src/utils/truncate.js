export function truncate(text = '', max = 100) {
  if (!text) return '';
  const clean = text.toString();
  return clean.length > max ? clean.slice(0, max).trimEnd() + '...' : clean;
}
