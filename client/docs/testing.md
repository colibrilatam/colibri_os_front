# Testing

## Stack

- **Vitest 4** — runner
- **MSW 2** — mock de red (Service Worker)
- **Testing Library** — React
- **jsdom** — DOM virtual

## Comandos

```bash
npm test          # Modo watch
npm run test:run  # Single run (CI)
```

Ambos scripts exportan `NEXT_PUBLIC_BACKEND_URL=https://api.colibrilatam.io/api/v1`
para que el cliente axios tenga un `baseURL` estable durante los tests.

## Estructura

```
src/lib/api/__tests__/           # Tests del cliente HTTP
src/services/__tests__/          # Tests de servicios (mock apiClient)
src/hooks/__tests__/             # Tests de hooks
src/test/                        # Utilidades (QueryClient wrapper, MSW handlers)
```

## Estrategias

### Servicios

```js
vi.mock('@/lib/api');

it('llama al endpoint correcto y transforma la respuesta', async () => {
  apiClient.get.mockResolvedValue({ data: [...] });
  const result = await userService.profile();
  expect(apiClient.get).toHaveBeenCalledWith('/users/profile');
});
```

### Hooks

- Mockear servicios y store de Zustand.
- Proveer un `QueryClientProvider` con `retry: false`.
- Verificar flujos de éxito y de error.
- Verificar que `ApiError` se convierte a mensaje de usuario.

### Cliente HTTP

- Verifica interceptores (inyección de token, `x-request-id`,
  normalización de errores).
- Mockea con MSW para simular respuestas del backend.

## Cobertura

Para ver el estado actual:

```bash
npm run test:run -- --coverage
```

> Los docs `arquitectura-capa-http.md` y `tanstack-query-migration.md`
> reportan números distintos (74 y 98). El número fijo dejó de
> mantenerse actualizado — usar la salida del comando como fuente de
> verdad.

## Agregar un test

1. Colocarlo en `__tests__/` junto al archivo que prueba.
2. Nombrarlo `*.test.js`.
3. Si usa React → importar de `@testing-library/react`.
4. Si mockea red → usar handlers de MSW en `src/test/msw/`.

## CI

Pendiente. Actualmente los tests se corren manualmente antes de cada PR.
