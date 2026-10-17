import contractVersion from './CONTRACT_VERSION.json';

/**
 * Extrae el número MAJOR de una versión SemVer.
 * Ej: "1.0.0" -> 1, "2.5.3" -> 2
 */
export function parseMajor(version) {
  const match = String(version).match(/^(\d+)\./);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Compara la versión del contrato del backend (header X-Contract-Version)
 * con la versión local del frontend.
 * Emite console.warn si los MAJOR difieren. No bloquea, no lanza, no muestra UI.
 */
export function checkContractVersion(response) {
  const serverVersion = response.headers['x-contract-version'];
  if (!serverVersion) {
    return;
  }

  const localVersion = contractVersion.version;
  const serverMajor = parseMajor(serverVersion);
  const localMajor = parseMajor(localVersion);

  if (serverMajor > localMajor) {
    console.warn(
      '[Contract] El backend tiene MAJOR más nuevo. Actualizá el cliente.',
      { local: localVersion, server: serverVersion },
    );
  } else if (serverMajor < localMajor) {
    console.warn(
      '[Contract] El backend tiene MAJOR más viejo. Actualizá el backend.',
      { local: localVersion, server: serverVersion },
    );
  }
}