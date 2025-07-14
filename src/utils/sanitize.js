export function sanitize(text = '') {
  if (!text) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  const decoded = textarea.value;
  return decoded.replace(/\s+/g, ' ').trim();
}
