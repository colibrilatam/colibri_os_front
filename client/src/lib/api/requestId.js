let counter = 0;

/**
 * Genera un ID de correlación único por request.
 * Formato: <timestamp>-<counter>-<random>
 * @returns {string}
 */
export function generateRequestId() {
  counter = (counter + 1) % 10000;
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${ts}-${counter.toString().padStart(4, '0')}-${rand}`;
}
