# Título del componente / sistema

> Breve descripción de qué es, qué problema resuelve y por qué existe.

## Resumen

Párrafo ejecutivo con la idea central.

## Contexto y decisión

¿Por qué se construyó así? ¿Qué alternativas se consideraron y por qué
se descartaron? ¿Qué trade-offs se aceptaron?

## Estructura de archivos

```
src/carpeta/
├── archivo.js       # Qué hace
├── index.js         # Barrel file
└── __tests__/
    └── archivo.test.js
```

## Diagrama de flujo

```
[Componente A] ──→ [Módulo X] ──→ [Servicio Y]
                    │
                    ▼
              [Base de datos / API]
```

## Dependencias

| Dependencia | Versión | Propósito |
|---|---|---|
| `axios` | ^1.x | Cliente HTTP |
| `zustand` | ^5.x | Estado global |

## API / Interfaz pública

### `nombreDeLaFuncion(param1, param2)`

```js
// Firma
function nombreDeLaFuncion(param1: Tipo, param2: Tipo): TipoRetorno

// Ejemplo de uso
const resultado = nombreDeLaFuncion('valor', 42);
```

### Eventos que emite / recibe

| Evento | Origen | Destino | Datos |
|---|---|---|---|
| `evento-ejemplo` | Componente A | Store | `{ id, payload }` |

## Estados y manejo de errores

| Estado | Condición | Comportamiento |
|---|---|---|
| Cargando | Mientras se resuelve la promesa | Spinner / skeleton |
| Vacío | Array vacío o sin datos | Mensaje "sin resultados" |
| Error | `ApiError` o excepción | Toast / mensaje en UI |
| Éxito | Respuesta válida | Renderizar datos |

## Testing

```bash
npm test -- --grep "nombre del test"
```

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unitario | `src/__tests__/nombre.test.js` | Lógica pura, sin mock |
| Integración | `src/__tests__/nombre.integration.test.js` | Interacción con servicios/API |

## Variables de entorno

| Variable | Obligatoria | Default | Descripción |
|---|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Sí | — | URL base del backend |
| `NEXT_PUBLIC_GATEWAY_URL` | No | — | URL de IPFS gateway |

## Consideraciones de seguridad

- Tokens / secrets que intervienen
- Validaciones de permisos
- Sanitización de inputs

## Performance

- Límites conocidos (ej. timeout 30s)
- Cache aplicada
- Paginación / lazy loading

## Logging y monitoreo

- Qué se loguea y en qué nivel (debug / info / error)
- IDs de correlación
- Eventos a trackear en analytics

## Configuración

| Parámetro | Valor | Ubicación |
|---|---|---|
| `timeout` | 30000 ms | `client.js:8` |
| `retryAttempts` | 3 | `config.js:15` |

## Cambios futuros / Deuda técnica

- [ ] Pendiente: agregar refresh token
- [ ] Pendiente: migrar a TypeScript

## Changelog

| Fecha | Cambio | Autor |
|---|---|---|
| 2026-07-27 | Creación inicial | — |
