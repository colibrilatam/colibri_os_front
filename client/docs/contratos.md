# Contratos FE ↔ BE — `@colibri/contracts`

## Qué es

El backend NestJS expone sus DTOs como **OpenAPI 3.1**. El paquete
`@colibri/contracts` genera esquemas **Zod v4** desde ese spec y los
copia al frontend. El frontend valida cada respuesta en runtime.

Esto detecta **drift** entre frontend y backend **antes** de que
produzca un bug en producción.

## Flujo completo

```
NestJS (DTOs + @ApiProperty)
    ↓ npm run contract:export
packages/contracts/src/openapi.json
    ↓ npm run generate-zod (openapi-zod)
packages/contracts/src/generated/schemas.ts
    ↓ npm run copy-contracts
client/src/lib/contracts/generated/schemas.ts
    ↓ Frontend: validateResponse(schema, data)
Validación runtime en cada respuesta
```

## Archivos generados en el frontend

Ruta: `src/lib/contracts/generated/`

| Archivo | Origen | ¿Editable? |
|---|---|---|
| `schemas.ts` | Generado desde OpenAPI | ❌ No editar a mano |
| `manual-schemas.ts` | Escrito por devs | ✅ Sí |
| `index.ts` | Re-export | ❌ Generado |
| `CONTRACT_VERSION.json` | Copiado | ❌ |

## Uso en el frontend

```js
import { validateResponse, ProjectSchema } from '@/lib/contracts/generated';

const raw = await apiClient.get('/projects/123');
const project = validateResponse(ProjectSchema, raw);
```

Si el payload no matchea el schema, se lanza un error en desarrollo.
En producción conviene loguear (para detectar drift) sin romper la UI.

## Regeneración

Los comandos **viven en el backend**, no en el frontend:

```bash
# En colibri_os_back/
npm run contract:sync     # genera + copia al frontend
npm run contract:check    # valida breaking changes
```

El script de copia usa la variable `COLIBRI_FRONTEND_ROOT` para saber
dónde está el repo del frontend.

## Breaking changes

El workflow `contracts.yml` (backend) compara el `openapi.json` del PR
contra la rama base. Si detecta un cambio rompiente, falla y **exige
subir el MAJOR** en `packages/contracts/CONTRACT_VERSION.json`.

Cambios rompientes típicos:
- Campo requerido eliminado.
- Tipo de campo cambiado.
- Enum reducido.
- Nuevo campo requerido.

## Documentación completa

Ver el `README.md` del paquete en el repo del backend:
`colibri_os_back/packages/contracts/README.md`.
