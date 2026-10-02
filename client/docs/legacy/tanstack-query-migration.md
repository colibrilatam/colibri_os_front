# Migración a TanStack Query

## Visión General

Migración completa de la gestión de datos remotos del frontend de Colibrí de un enfoque manual (`useRequest`/`handleRequest`) a **TanStack Query** (React Query v5), centralizando caché, invalidaciones, reintentos y estados `loading`/`error`/`stale`.

## Objetivos

- Eliminar estados inconsistentes entre componentes
- Eliminar peticiones duplicadas al backend
- Centralizar la lógica de retry con políticas claras
- Obtener devtools de desarrollo para debugging de queries
- Simplificar la gestión de datos en páginas y componentes

## Arquitectura

### Infraestructura

| Archivo | Descripción |
|---------|-------------|
| `src/lib/query-client.js` | Configuración global del `QueryClient` con retry inteligente |
| `src/lib/query-keys.js` | Centralización de query keys por recurso |
| `src/app/ClientLayout.jsx` | Envuelve la app en `QueryClientProvider` |
| `src/test/query-provider.jsx` | Wrapper para tests con `QueryClient` de prueba |

### Query Keys (`src/lib/query-keys.js`)

```javascript
export const queryKeys = {
  projects: {
    all: ['projects'],
    detail: (id) => ['projects', id],
    microActions: (id) => ['projects', id, 'microActions'],
    evidences: (id) => ['projects', id, 'evidences'],
    tramos: (id) => ['projects', id, 'tramos'],
    tramoData: (id) => ['projects', id, 'tramoData'],
    nft: (id) => ['projects', id, 'nft'],
  },
  microActions: {
    all: ['microActions'],
    detail: (id) => ['microActions', id],
    versions: (id) => ['microActions', id, 'versions'],
  },
  evidences: {
    all: ['evidences'],
    detail: (id) => ['evidences', id],
    versions: (id) => ['evidences', id, 'versions'],
    evaluations: (id) => ['evidences', id, 'evaluations'],
  },
  evaluations: {
    all: ['evaluations'],
    byEvidence: (id) => ['evaluations', 'evidence', id],
  },
  users: {
    profile: ['users', 'profile'],
    detail: (id) => ['users', id],
  },
  tramos: {
    all: ['tramos'],
  },
  nft: {
    projects: ['nft', 'projects'],
    stats: ['nft', 'stats'],
  },
  rubrics: {
    active: ['rubrics', 'active'],
  },
};
```

### Retry Inteligente (`src/lib/query-client.js`)

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000,   // 10 minutos
      retry: (failureCount, error) => {
        if (error?.status >= 400 && error?.status < 500) return false;
        if (failureCount >= 2) return false;
        return true;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
    },
  },
});
```

**Política de retry:**
- Reintenta errores de red, timeout y 5xx
- Máximo 2 reintentos
- Nunca reintenta errores 4xx (bad request, unauthorized, etc.)
- Backoff exponencial: 1s, 2s, 4s... máximo 30s

## Hooks de Query (`src/hooks/queries/`)

### Proyectos

| Hook | Descripción | Query Key |
|------|-------------|-----------|
| `useProjects()` | Lista todos los proyectos | `queryKeys.projects.all` |
| `useProject(id)` | Detalle de un proyecto | `queryKeys.projects.detail(id)` |
| `useProjectTramo(tramoId)` | Datos del tramo de un proyecto | `queryKeys.projects.tramos(id)` |
| `useProjectTramoData(id)` | Datos adicionales del tramo | `queryKeys.projects.tramoData(id)` |
| `useProjectEvidences(id)` | Evidencias de un proyecto | `queryKeys.projects.evidences(id)` |
| `useProjectMicroActions(id)` | Microacciones de un proyecto | `queryKeys.projects.microActions(id)` |
| `useProjectNft(id)` | NFT de un proyecto | `queryKeys.projects.nft(id)` |

### Microacciones

| Hook | Descripción | Query Key |
|------|-------------|-----------|
| `useMicroActions()` | Lista todas las microacciones | `queryKeys.microActions.all` |
| `useMicroAction(id)` | Detalle de una microacción | `queryKeys.microActions.detail(id)` |
| `useMicroActionEvidences(id)` | Evidencias de una microacción | - |
| `useEvidenceVersions(id)` | Versiones de una evidencia | `queryKeys.evidences.versions(id)` |

### Evidencias

| Hook | Descripción | Query Key |
|------|-------------|-----------|
| `useEvidence(id)` | Detalle de una evidencia | `queryKeys.evidences.detail(id)` |
| `useEvidenceEvaluations(id)` | Evaluaciones de una evidencia | `queryKeys.evidences.evaluations(id)` |

### Evaluaciones

| Hook | Descripción | Query Key |
|------|-------------|-----------|
| `useEvaluation(id)` | Detalle de una evaluación | `queryKeys.evaluations.all` |
| `useEvaluations()` | Lista todas las evaluaciones | `queryKeys.evaluations.all` |
| `useActiveRubrics()` | Rúbricas activas | `queryKeys.rubrics.active` |
| `usePendingReviews()` | Reseñas pendientes | - |

### Usuarios y NFT

| Hook | Descripción | Query Key |
|------|-------------|-----------|
| `useUser()` | Datos del usuario actual | `queryKeys.users.profile` |
| `useUserProfile(id)` | Perfil de un usuario | `queryKeys.users.detail(id)` |
| `useTramos()` | Lista de tramos | `queryKeys.tramos.all` |
| `useNftProjects()` | Proyectos NFT | `queryKeys.nft.projects` |
| `useNftProjectsInfo()` | Info de proyectos NFT | - |
| `useNftStats()` | Estadísticas NFT | `queryKeys.nft.stats` |

## Hooks de Mutación (`src/hooks/mutations/`)

| Hook | Descripción | Invalidación |
|------|-------------|--------------|
| `useLogin()` | Inicio de sesión | `queryKeys.users.profile` |
| `useNewProject()` | Crear proyecto completo | `queryKeys.projects.all`, `detail`, `microActions`, `evidences` |
| `useUpdatePacStatus()` | Actualizar estado PAC | `queryKeys.projects.detail(projectId)` |
| `useCreateMicroActionVersion()` | Crear versión de microacción | `queryKeys.microActions.detail(instanceId)`, `all` |
| `useSubmitEvidence()` | Enviar evidencia | `queryKeys.evidences.detail(id)`, `all` |
| `useConfirmUpload()` | Confirmar subida | `queryKeys.evidences.detail(id)`, `versions(id)` |
| `useCreateEvaluation()` | Crear evaluación | `queryKeys.evidences.detail(id)`, `evaluations.byEvidence(id)` |
| `useRequestUploadSignature()` | Solicitar firma de subida | Sin invalidación |
| `useCreateEvidence()` | Crear evidencia | - |
| `useDeleteEvidence()` | Eliminar evidencia | - |
| `useUpdateEvidence()` | Actualizar evidencia | - |
| `useDeleteProject()` | Eliminar proyecto | - |
| `useUpdateProject()` | Actualizar proyecto | - |
| `useCreateProject()` | Crear proyecto | - |
| `useFinalizeEvaluation()` | Finalizar evaluación | - |
| `useSubmitHumanReview()` | Enviar revisión humana | - |

## Páginas Migradas

- `src/app/home/page.jsx` - Home con `useProjects()`, `useTramos()`
- `src/app/login/page.jsx` - Login con `useProjects()`
- `src/app/proyecto/page.jsx` - Proyecto con `useProjects()`
- `src/app/evaluations/page.jsx` - Evaluaciones con `useProjects()`, `useEvaluations()`
- `src/app/user/nft/page.jsx` - NFT con `useProjects()`, `useUser()`
- `src/app/dashboard/[id]/layout.jsx` - Layout del dashboard (Client Component)
- `src/app/dashboard/[id]/about/page.jsx` - About del proyecto
- `src/app/dashboard/[id]/tramo/page.jsx` - Tramo del proyecto
- `src/app/dashboard/[id]/trayectoria/OldPage.jsx` - Trayectoria legacy
- `src/app/dashboard/[id]/trayectoria/NewPage.jsx` - Trayectoria nueva
- `src/app/dashboard/[id]/trayectoria/UploadModal.jsx` - Modal de subida
- `src/components/MainHeader.jsx` - Header principal

## Cambios en `apiClient`

**Antes:** `apiClient` manejaba retry internamente con `setRetryListener`.

**Ahora:** `apiClient` solo normaliza errores. El retry se delega completamente a TanStack Query.

```javascript
// src/lib/api/client.js (actual)
const apiClient = {
  async get(url, config) {
    try {
      const response = await client.get(url, config);
      return response.data;
    } catch (error) {
      throw normalizeError(error);
    }
  },
  // ... métodos similares para post, put, patch, delete
};
```

## Deprecaciones

- `src/hooks/useRequest.js` → Deprecated con `console.warn` en desarrollo. Usar hooks de TanStack Query.
- `src/lib/handleRequest.js` → Deprecated con `console.warn` en desarrollo. Usar hooks de TanStack Query.
- `src/lib/api/index.js` → `setRetryListener` es now-op (no-op) para compatibilidad.

## Desarrollo

### DevTools

Los devtools de TanStack Query están disponibles en modo desarrollo:

```javascript
// src/app/ClientLayout.jsx
const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then((mod) => mod.ReactQueryDevtools),
  { ssr: false }
);

// Solo se muestra en desarrollo
{process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
```

### Agregar un Nuevo Hook de Query

```javascript
// src/hooks/queries/useMiRecurso.js
'use client';

import { useQuery } from '@tanstack/react-query';
import { miRecursoService } from '@/services/miRecurso';
import { queryKeys } from '@/lib/query-keys';

export function useMiRecurso(id) {
  return useQuery({
    queryKey: queryKeys.miRecurso.detail(id),
    queryFn: () => miRecursoService.getById(id),
    enabled: !!id,
  });
}
```

### Agregar un Nuevo Hook de Mutación

```javascript
// src/hooks/mutations/useCreateMiRecurso.js
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { miRecursoService } from '@/services/miRecurso';
import { queryKeys } from '@/lib/query-keys';

export function useCreateMiRecurso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => miRecursoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.miRecurso.all,
      });
    },
  });
}
```

## Tests

Los tests requieren un `QueryClientProvider` wrapper:

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function createWrapper() {
  const queryClient = createTestQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Uso en tests
const { result } = renderHook(() => useMiHook(), { wrapper: createWrapper() });
```

## Resultados

- **Tests:** 98/98 pasando
- **Build:** Exitoso sin errores
- **Lint:** Errores de migración corregidos; errores preexistentes pendientes
