/** Flattens a nested object into dot-path → value pairs (arrays are kept as a single JSON string leaf). */
export function flattenObject(obj: unknown, prefix = ''): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (obj === null || obj === undefined) return out;
  if (typeof obj !== 'object') {
    out[prefix || 'value'] = obj;
    return out;
  }
  if (Array.isArray(obj)) {
    out[prefix || 'value'] = JSON.stringify(obj);
    return out;
  }
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(out, flattenObject(value, path));
    } else if (Array.isArray(value)) {
      out[path] = JSON.stringify(value);
    } else {
      out[path] = value;
    }
  }
  return out;
}
