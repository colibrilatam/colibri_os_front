const { execSync } = require('child_process');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env.e2e') });

const BACKEND_URL = process.env.E2E_BACKEND_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@e2e.colibri';
const PASSWORD = process.env.E2E_PASSWORD || 'E2e@Passw0rd!';

async function waitFor(url, { timeoutMs = 120_000, intervalMs = 2_000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      lastError = new Error(`HTTP ${response.status} en ${url}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(
    `Global setup: ${url} no respondió a tiempo. Último error: ${lastError?.message ?? 'desconocido'}`,
  );
}

function runBootstrap() {
  if (process.env.E2E_BOOTSTRAP !== 'true') return;

  const backendDir = path.resolve(
    __dirname,
    process.env.E2E_BACKEND_DIR || '../../colibri_os_back',
  );
  console.log(`[e2e] Bootstrap habilitado. Corriendo migraciones + seed en ${backendDir}`);

  execSync('npm run migration:run', { cwd: backendDir, stdio: 'inherit' });
  execSync('npm run seed:e2e', { cwd: backendDir, stdio: 'inherit' });
}

/**
 * Re-siembra el dataset E2E antes de cada corrida para que la suite sea
 * re-ejecutable sin recrear el entorno. Algunos tests mutan estado de forma
 * intencional (suspender usuario, cambiar rol, cerrar sesión), por lo que sin
 * el reseed una segunda corrida fallaría.
 */
function reseed() {
  if (process.env.E2E_RESEED !== 'true') return;

  const composeFile = process.env.E2E_COMPOSE_FILE;
  if (composeFile) {
    console.log('[e2e] Reseed vía docker compose exec...');
    execSync(
      `docker compose --env-file .env.e2e -f ${composeFile} exec -T backend npm run seed:e2e`,
      { cwd: __dirname, stdio: 'inherit' },
    );
    return;
  }

  if (process.env.E2E_BACKEND_DIR) {
    console.log('[e2e] Reseed vía npm run seed:e2e...');
    execSync('npm run seed:e2e', {
      cwd: path.resolve(__dirname, process.env.E2E_BACKEND_DIR),
      stdio: 'inherit',
    });
  }
}

async function verifySeed() {
  const response = await fetch(`${BACKEND_URL}/api/v1/auth/signin`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: PASSWORD }),
  });

  if (![200, 201].includes(response.status)) {
    throw new Error(
      `Global setup: el dataset E2E no está disponible (signin admin -> ${response.status}). ` +
        'Ejecutá `npm run seed:e2e` en el backend o levantá el entorno con docker compose.',
    );
  }
}

module.exports = async () => {
  runBootstrap();
  await waitFor(`${BACKEND_URL}/api/v1/ready`);
  reseed();
  await waitFor(`${process.env.E2E_FRONTEND_URL || 'http://localhost:3031'}/login`);
  await verifySeed();
  console.log('[e2e] Entorno listo: backend, frontend y dataset E2E verificados.');
};
