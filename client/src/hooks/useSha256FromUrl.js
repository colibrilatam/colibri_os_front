
export async function getHashFromUrl(fileUrl) {
  // 1. Descargar el archivo como ArrayBuffer
  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();

  // 2. Calcular el hash SHA-256 usando Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);

  // 3. Convertir el ArrayBuffer a un string hexadecimal
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // 4. Devolverlo con el prefijo '0x' (formato que espera Story Protocol)
  return `0x${hashHex}`;
}
