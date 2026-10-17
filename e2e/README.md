# QA-001 — Suite E2E (Playwright)

Suite end-to-end de sesión, permisos, CSRF y OAuth sobre un entorno aislado.
Cubre los criterios de aceptación de QA-001:

- usuario anónimo, usuario, evaluador y administrador;
- expiración y revocación de sesión;
- respuestas 401 y 403;
- pruebas negativas: manipular el rol local, acceder a un recurso de otra
  organización (proyecto) y reutilizar una sesión cerrada.

## Estructura

```
e2e/
  playwright.config.js       # baseURL FE, Chromium, workers=1, reporters html+junit
  global-setup.js            # espera backend/frontend, verifica/resiembra el dataset
  docker-compose.e2e.yml     # entorno aislado: Postgres tmpfs + backend + frontend
  .env.e2e                   # URLs, credenciales E2E y secreto JWT de test
  fixtures/                  # users.ts, auth.ts (login UI + cookies)
  helpers/                   # api.ts (cliente con cookie+CSRF), db.ts, oauth-fake.ts
  tests/                     # specs por criterio (01..06) + security/
```

## Correr en local

Requisitos: Docker, Node 22+.

```bash
cd e2e
npm install
npx playwright install chromium

# 1) Levantar el entorno aislado (build + up + wait healthy)
npm run env:up

# 2) Correr la suite
npm test
#   o: npx playwright test 06-oauth   -> un archivo
#       npx playwright test --ui      -> modo interactivo

# 3) Bajar y limpiar (borra la DB efímera)
npm run env:down
```

El `global-setup` re-siembra el dataset antes de cada corrida
(`E2E_RESEED=true`), por lo que la suite es re-ejecutable sin recrear el
entorno.

### Sin Docker (backend/frontend nativos)

Si ya tenés Postgres y los procesos corriendo con `NODE_ENV=test`:

```bash
# en colibri_os_back
npm run migration:run && npm run seed:e2e && npm run build
E2E_OAUTH_FAKE=true node dist/src/main.js   # puerto 3000

# en colibri_os_front/client
npm run build && npm run start              # puerto 3031

# en colibri_os_front/e2e  (ajustá E2E_DATABASE_URL a tu DB)
E2E_RESEED=false npx playwright test
```

## Entorno aislado (docker compose)

`docker-compose.e2e.yml` levanta:

| Servicio  | Detalle                                                                 |
|-----------|-------------------------------------------------------------------------|
| `db`      | `postgres:16-alpine` efímero (tmpfs), host `5433`.                       |
| `backend` | `Dockerfile.e2e` (BE): `NODE_ENV=test`, migraciones + seed E2E + app.    |
| `frontend`| Build de producción de Next.js (`next start -p 3031`).                   |

El backend usa **OAuth fake** (`E2E_OAUTH_FAKE=true`): simula el flujo de
Google sin llamar al proveedor externo.

Variable `E2E_BACKEND_CONTEXT` / `E2E_FRONTEND_CONTEXT` permiten ubicar los
repos cuando no están en la disposición `../` esperada (por ejemplo en CI).

## CI

`.github/workflows/e2e.yml` (repo frontend) hace checkpoint del backend
(`colibrilatam/colibri_os_back@dev`), levanta un Postgres de servicio, aplica
migraciones, siembra el dataset, arranca backend y frontend, instala Chromium y
corre la suite. Publica `playwright-report/` y `test-results/` como artefactos.
El job falla el pipeline si Playwright falla.

> Si `colibri_os_back` es privado, configurar el secret
> `E2E_BACKEND_REPO_TOKEN` (PAT con permiso de lectura sobre ese repo). Si es
> público, el token por defecto del workflow alcanza.

## Casos cubiertos

| ID   | Escenario                                                                 |
|------|---------------------------------------------------------------------------|
| T-01 | Anónimo → ruta protegida exige login                                       |
| T-02 | Anónimo → endpoint protegido 401                                           |
| T-03 | Login UI (usuario) → cookie HttpOnly + redirect                            |
| T-04 | Usuario → su propio proyecto                                               |
| T-05 | Evaluador → evaluaciones asignadas                                         |
| T-06 | Evaluador no asignado → 403                                                |
| T-07 | Admin → administración de usuarios                                         |
| T-08 | No-admin intenta cambiar rol → 403                                         |
| T-09 | Token expirado → 401                                                       |
| T-10 | Suspensión → sesión revocada (401)                                         |
| T-11 | Cambio de rol → sesión previa revocada (401)                               |
| T-12 | **N1** rol local manipulado no habilita acción admin (403)                 |
| T-13 | **N2** usuario A no accede al proyecto B (403)                             |
| T-14 | **N3** reutilizar sesión cerrada → 401                                     |
| T-15 | Logout UI limpia la cookie de sesión                                       |
| T-16 | CSRF: sin header / header manipulado → 403; válido → pasa                  |
| T-17 | OAuth callback solo con `code` (sin tokens en URL)                         |
| T-18 | Código de intercambio de un solo uso                                       |
| T-19 | 404 recurso inexistente vs 403 recurso ajeno                               |
| T-20 | Tras revocar, re-login funciona y el token viejo sigue inválido            |
| T-21 | Cookie de sesión HttpOnly; cookie CSRF legible por JS                      |
| T-22 | PENDING_PROFILE completa perfil sin persistir tokens en storage            |
