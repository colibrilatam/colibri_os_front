# Roles y protección de rutas

## Roles disponibles

Definidos en el backend (`UserRole` enum):

| Rol | Descripción |
|---|---|
| `entrepreneur` | Emprendedor — dueño de proyectos |
| `mentor` | Mentor de proyectos |
| `evaluator` | Evaluador de evidencias |
| `mecenas_semilla` | Mecenas nivel semilla |
| `mecenas_fundacional` | Mecenas nivel fundacional |
| `mecenas_cambio` | Mecenas nivel cambio |
| `admin` | Administrador de plataforma |
| `guest` | Invitado (acceso limitado) |

## Protección de rutas — `layoutConfig.js`

El mapa de rutas vive en `src/lib/layoutConfig.js` (o equivalente):

```js
export const routeConfig = {
  routes: [
    {
      path: '/evaluations',
      protected: true,
      roles: ['admin', 'mentor', 'evaluator', 'entrepreneur'],
      header: 'main',
      padding: 'pt-24',
    },
    {
      path: '/dashboard',
      protected: true,
      roles: ['admin', 'entrepreneur', 'mentor', 'mecenas_semilla'],
      header: 'project',
      padding: 'pt-0',
    },
    // ...
  ],
};
```

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| `path` | string | Prefijo de la ruta (matchea con `startsWith`) |
| `protected` | boolean | `true` exige sesión activa |
| `roles` | string[] | Roles autorizados (solo si `protected`) |
| `header` | `'main'` \| `'project'` \| `null` | Variante de header |
| `padding` | string | Clase de Tailwind para el padding top |

### Fallback

```js
getRouteConfig(pathname) // → routeConfig.routes.find(...) || {
  //   protected: false,
  //   header: null,
  //   padding: '',
  //   roles: ['admin'],
  // }
```

Rutas no listadas → no protegidas, sin header especial, con `padding` vacío.

## Mapa actual de rutas

| Ruta | Protegida | Roles | Header |
|---|---|---|---|
| `/evaluations` | ✅ | admin, mentor, evaluator, entrepreneur | main |
| `/dashboard` | ✅ | admin, entrepreneur, mentor, mecenas_semilla | project |
| `/user` | ✅ | admin, entrepreneur, mecenas_semilla | project |
| `/proyecto` | ✅ | admin, entrepreneur, mecenas_semilla | main |
| `/admin` | ✅ | admin | main |
| `/login` | ❌ | — | — |
| `/home` | ✅ | admin, entrepreneur, mentor, mecenas_semilla | project |

## Cómo agregar una ruta nueva

1. Agregar la entrada al array `routes` de `layoutConfig.js`.
2. Definir `roles` según los actores que deben acceder.
3. Elegir el `header` (`main` para páginas públicas, `project` para
   páginas con contexto de proyecto).
4. Ajustar `padding` según la altura del header.

## Verificación

El chequeo de rol sucede en el layout correspondiente (Server o Client
Component) leyendo el JWT o el perfil del usuario. Ver los archivos en
`src/app/**/layout.jsx`.

> ⚠️ El backend **también** valida roles por endpoint. La protección
> del frontend es UX, no seguridad.
