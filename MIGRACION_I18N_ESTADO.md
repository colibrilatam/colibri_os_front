# Migracion a Columnas Multi-idioma (i18n)

## Resumen

Se implemento un sistema para consumir las nuevas columnas multi-idioma (`_es` / `_en`) agregadas en las tablas del backend, reemplazando las antiguas columnas unificadas (`name`, `description`, `title`, etc.).

**Estrategia elegida**: Hook personalizado (`useLocalizedField`) que selecciona automaticamente el campo correcto segun el idioma del usuario.

---

## Arquitectura

### Sistema de i18n existente

| Capa | Mecanismo | Ubicacion |
|---|---|---|
| Textos estaticos de la UI | `useTranslation` con archivos JSON | `locales/es.json`, `locales/en.json` |
| Contenido dinamico (legacy) | `useTranslatedContent` (traduccion bajo demanda) | `hooks/useTranslatedContent.js` |
| Idioma del usuario | Zustand store | `lib/store.js` → `useUserStore.language` |

### Nueva capa agregada

```
┌────────────────────────────────────┐
│         Backend (TypeORM)          │
│  name_es  │  name_en  │  code │ ...│
└────────────────────┬───────────────┘
                     │ API REST
                     ▼
┌────────────────────────────────────┐
│   useLocalizedField(obj, field)    │
│                                    │
│   language === 'es'                │
│     → obj.field_es                 │
│   language === 'en'                │
│     → obj.field_en                 │
│   Fallback:                        │
│     field_actual → field_en → ''   │
└────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────┐
│         Componentes React          │
│  {tramoName} {pacTitle} {etc...}   │
└────────────────────────────────────┘
```

---

## Archivos Creados

### `hooks/useLocalizedField.js`

Hook y funcion utilitaria para obtener campos localizados.

```javascript
// Hook - dentro de componentes React
export function useLocalizedField(obj, fieldBase) {
  const language = useUserStore((state) => state.language);
  if (!obj || !fieldBase) return '';
  const localizedValue = obj[`${fieldBase}_${language}`];
  if (!localizedValue) {
    return obj[`${fieldBase}_en`] || obj[fieldBase] || '';
  }
  return localizedValue;
}

// Utilitaria - fuera de componentes (maps, callbacks, etc.)
export function getLocalizedValue(obj, fieldBase, language) {
  if (!obj || !fieldBase) return '';
  const localizedValue = obj[`${fieldBase}_${language}`];
  if (!localizedValue) {
    return obj[`${fieldBase}_en`] || obj[fieldBase] || '';
  }
  return localizedValue;
}
```

**Por que dos versiones?**
- `useLocalizedField`: Hook de React, se suscribe al store de idioma. Solo puede usarse en el nivel superior de componentes.
- `getLocalizedValue`: Funcion pura, recibe el idioma como parametro. Se usa dentro de `.map()`, callbacks y componentes hijos donde no se quiere/crea un hook.

---

## Archivos Modificados

### 1. `hooks/index.js`
Se agregaron los exports del nuevo hook.

```javascript
export { useLocalizedField, getLocalizedValue } from './useLocalizedField';
```

### 2. `components/Header.jsx`
**Cambio**: `tramoData.name` → `tramoName` (localizado)

```diff
+ import { useLocalizedField } from '@/hooks/useLocalizedField';

  export default function Header({ isHome = false }) {
+   const tramoName = useLocalizedField(contextData?.tramoData, 'name');

-   {tramoData.code} - {tramoData.name}
+   {tramoData.code} - {tramoName}
```

### 3. `app/dashboard/[id]/identidad/page.jsx`
**Cambio**: `tramoData.name` → `tramoName` (localizado)

```diff
+ import { useLocalizedField } from '@/hooks/useLocalizedField';

+ const tramoName = useLocalizedField(tramoData, 'name');

- {tramoData.name || t('tramoNameFallback')}
+ {tramoName || t('tramoNameFallback')}
```

### 4. `app/dashboard/[id]/tramo/page.jsx`
**Cambio**: `currentState.currentTramoName` → `tramoName` (localizado desde datos reales)

```diff
+ import { useLocalizedField } from '@/hooks/useLocalizedField';

+ const tramoName = useLocalizedField(tramoData, 'name');

  const tramo = {
    code: currentState.currentTramoCode,
-   name: currentState.currentTramoName,
+   name: tramoName,
  };
```

### 5. `app/dashboard/[id]/trayectoria/NewPage.jsx`
**Cambios**: PAC title, objectiveLine, tramo name, micro-action instruction

```diff
+ import { useLocalizedField, getLocalizedValue } from '@/hooks/useLocalizedField';

  // Nivel superior del componente principal (antes del return)
+ const selectedPacTitle = useLocalizedField(selectedPac?.pac, 'title');
+ const selectedPacObjective = useLocalizedField(selectedPac?.pac, 'objectiveLine');
+ const tramoNameLocalized = useLocalizedField(tramoData, 'name');

  // En el componente PacCard (componente interno)
  const PacCard = ({ pac, ... }) => {
+   const pacTitle = useLocalizedField(pac.pac, 'title');
-   {pac.pac.title}
+   {pacTitle}
  };

  // En RealCargaPac (componente interno, dentro de .map())
  const RealCargaPac = ({ ... }) => {
+   const language = useUserStore((state) => state.language);

    {microActions.map((ma) => {
-     const instruction = ma.microActionDefinition?.instruction || t('noDescription');
+     const instruction = getLocalizedValue(ma.microActionDefinition, 'instruction', language) || t('noDescription');
    })}
  };
```

### 6. `app/dashboard/[id]/trayectoria/components/Microacciones.jsx`
**Cambio**: `pac.title` → localizado con `getLocalizedValue`

```diff
- import { useLocalizedField } from '@/hooks/useLocalizedField';
+ import { getLocalizedValue } from '@/hooks/useLocalizedField';
+ import { useUserStore } from '@/lib/store';

  export default function Microacciones({ pacs }) {
+   const language = useUserStore((state) => state.language);

    {pacs.map((pac) => {
-     // No se puede usar useLocalizedField dentro de .map()
+     const pacTitle = getLocalizedValue(pac, 'title', language);
-     {pac.title}
+     {pacTitle}
    })}

-   {selectedPac.title}
+   {getLocalizedValue(selectedPac, 'title', language)}
```

### 7. `app/dashboard/[id]/layout.jsx`
**Cambio**: Se agrego comentario documentando el estado temporal.

```diff
+ // NOTA: La tabla projects AUN no tiene columnas _es/_en
+ // Cuando se agreguen, reemplazar estos hardcodeos con:
+ // projectData.name_en, projectData.tagline_en, projectData.shortDescription_en
  projectData.shortDescription_en = 'Fintech project...';
  projectData.tagline_en = 'Streamlines reconciliations...';
```

---

## Entidades del Backend

### Migradas (columnas antiguas eliminadas)

| Tabla | Campos nuevos | Campos eliminados |
|---|---|---|
| `tramos` | `name_es`, `name_en`, `description_es`, `description_en`, `eligibility_rule_es`, `eligibility_rule_en` | `name`, `description`, `eligibility_rule` |
| `pacs` | `title_es`, `title_en`, `objective_line_es`, `objective_line_en` | `title`, `objective_line` |
| `categories` | `name_es`, `name_en`, `description_es`, `description_en` | `name`, `description` |
| `rubrics` | `name_es`, `name_en`, `description_es`, `description_en` | `name`, `description` |
| `micro_action_definitions` | `instruction_es`, `instruction_en` | `instruction` |

### Pendiente de migrar

| Tabla | Campos actuales | Columnas nuevas necesarias |
|---|---|---|
| `projects` | `projectName`, `tagline`, `shortDescription` | `name_es`, `name_en`, `tagline_es`, `tagline_en`, `shortDescription_es`, `shortDescription_en` |

---

## Commits

```
5f4df2b docs: add i18n migration status document
0f1e334 docs: add note about pending projects table migration
eb50fd7 feat: migrate components to use localized fields for tramos and PACs
2a343aa feat: add useLocalizedField hook for multi-language support
```

---

## Proximos Pasos

### 1. Migrar tabla `projects` en el backend

Crear migracion TypeORM similar a `1785171126021-AddTranslateColumns.ts`:
- Agregar columnas `name_es`, `name_en`, `tagline_es`, `tagline_en`, `shortDescription_es`, `shortDescription_en`
- Copiar valores existentes a columnas `_es`
- Eliminar columnas antiguas

### 2. Actualizar componentes de `projects`

Archivos pendientes (~9 archivos, ~20 usos):

| Archivo | Campos a migrar |
|---|---|
| `components/home/LandingProjectCard.jsx` | `projectName`, `shortDescription`, `tagline` |
| `components/Header.jsx` | `projectName` |
| `components/Sidebar.jsx` | `projectName` |
| `app/dashboard/[id]/about/page.jsx` | `projectName`, `tagline`, `shortDescription` |
| `app/home/page.jsx` | `projectName`, `shortDescription`, `tagline` (filtros de busqueda) |
| `app/dashboard/[id]/identidad/page.jsx` | `projectName` |
| `app/dashboard/[id]/layout.jsx` | `projectName` |
| `app/user/nft/page.jsx` | `projectName` |
| `app/proyecto/page.jsx` | `projectName`, `tagline`, `shortDescription` |

Patron a aplicar:
```javascript
const projectName = useLocalizedField(project, 'name');
const projectTagline = useLocalizedField(project, 'tagline');
const projectDescription = useLocalizedField(project, 'shortDescription');
```

### 3. Verificar otros componentes

- `app/dashboard/[id]/trayectoria/OldPage.jsx` - tramo name/description
- `app/evaluations/` - datos de proyectos y evidencias

### 4. Limpieza

- Eliminar valores hardcodeados en `layout.jsx` (lineas 18-22)
- Evaluar si `useTranslatedContent` sigue siendo necesario
- Eliminar `useTranslatedContent` si las columnas ya vienen traducidas del backend

---

## Reglas de Uso del Hook

### Correcto

```javascript
// En el nivel superior del componente
function MiComponente({ tramo, pac }) {
  const tramoName = useLocalizedField(tramo, 'name');
  const pacTitle = useLocalizedField(pac, 'title');
  return <h1>{tramoName} - {pacTitle}</h1>;
}
```

```javascript
// Dentro de .map() usar getLocalizedValue
function Lista({ items }) {
  const language = useUserStore((state) => state.language);
  return items.map(item => (
    <span key={item.id}>{getLocalizedValue(item, 'name', language)}</span>
  ));
}
```

### Incorrecto

```javascript
// NO llamar hooks dentro de condicionales
function Mal({ data }) {
  if (data) {
    const name = useLocalizedField(data, 'name'); // ERROR
  }
}
```

```javascript
// NO llamar hooks dentro de .map()
function Mal({ items }) {
  return items.map(item => {
    const name = useLocalizedField(item, 'name'); // ERROR
    return <span>{name}</span>;
  });
}
```

---

## Consideraciones Tecnicas

- **Fallback automatico**: Si el campo en el idioma actual no existe, se intenta con ingles, y si tampoco existe se retorna string vacio.
- **Renders reactivos**: El hook se suscribe al store de Zustand, por lo que al cambiar el idioma los componentes se re-renderizan automaticamente.
- **Rendimiento**: `getLocalizedValue` es una funcion pura sin overhead de React, ideal para listas grandes.
- **Compatibilidad**: Mientras la tabla `projects` no se migre, los textos de proyectos seguiran usando las propiedades antiguas. El hook soporta ambos casos via fallback.
