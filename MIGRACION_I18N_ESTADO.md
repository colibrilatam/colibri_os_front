# Plan de Migración a Columnas Multi-idioma - Estado Actual

## ✅ Completado

### 1. Hook Creado
- **Archivo**: `hooks/useLocalizedField.js`
- **Funcionalidad**: Selecciona automáticamente el campo localizado según el idioma del usuario
- **Fallback**: Si no existe el valor en el idioma actual, usa inglés, luego el campo original

```javascript
// Uso básico en componentes
const tramoName = useLocalizedField(tramoData, 'name');
const pacTitle = useLocalizedField(pac, 'title');
```

### 2. Componentes Actualizados

#### Header.jsx
- ✅ Import de `useLocalizedField`
- ✅ Actualizado: `tramoData.name` → `tramoName` (línea 176)

#### identidad/page.jsx
- ✅ Import de `useLocalizedField`
- ✅ Actualizado: `tramoData.name` → `tramoName` (línea 153)

#### tramo/page.jsx
- ✅ Import de `useLocalizedField`
- ✅ Actualizado: `currentState.currentTramoName` → `tramoName` (línea 51)

#### trayectoria/NewPage.jsx
- ✅ Import de `useLocalizedField`
- ✅ Actualizado: `selectedPac.pac.title` → `useLocalizedField(selectedPac.pac, 'title')` (línea 410)
- ✅ Actualizado: `selectedPac.pac.objectiveLine` → `useLocalizedField(selectedPac.pac, 'objectiveLine')` (línea 414)
- ✅ Actualizado: `pac.pac.title` → `useLocalizedField(pac.pac, 'title')` (línea 697)

#### trayectoria/components/Microacciones.jsx
- ✅ Import de `useLocalizedField`
- ✅ Actualizado: `pac.title` → `pacTitle` con hook (línea 50)
- ✅ Actualizado: `selectedPac.title` → `useLocalizedField(selectedPac, 'title')` (línea 66)

### 3. Hooks Index
- ✅ Exportado `useLocalizedField` y `getLocalizedValue` en `hooks/index.js`

## ⚠️ Pendiente

### 1. Tabla Projects (IMPORTANTE)
**Estado**: La tabla `projects` AÚN no tiene columnas `_es/_en`

**Campos afectados**:
- `projectName` → necesitará `name_es`/`name_en`
- `tagline` → necesitará `tagline_es`/`tagline_en`
- `shortDescription` → necesitará `shortDescription_es`/`shortDescription_en`

**Archivos que necesitan actualización cuando se migre projects**:
- `components/home/LandingProjectCard.jsx` (líneas 48, 55, 79-80)
- `components/Header.jsx` (líneas 118, 156, 167)
- `components/Sidebar.jsx` (línea 222)
- `app/dashboard/[id]/about/page.jsx` (líneas 118, 133, 137-139, 171-177)
- `app/home/page.jsx` (líneas 167-169)
- `app/dashboard/[id]/identidad/page.jsx` (líneas 45, 62)
- `app/dashboard/[id]/layout.jsx` (líneas 69, 75, 83-84)
- `app/user/nft/page.jsx` (líneas 66, 70, 78, 184)
- `app/proyecto/page.jsx` (líneas 30, 40, 43-44, 53, 56-57, 65, 68-69)

**Nota**: En `layout.jsx` hay valores hardcodeados temporalmente (líneas 18-22) que deben eliminarse cuando se migre la tabla projects.

### 2. Otros Componentes con Datos de Tramos/PACs
**Pendiente verificar**:
- `app/dashboard/[id]/trayectoria/OldPage.jsx` (líneas 258, 260)
- `app/evaluations/[evaluationId]/page.jsx`
- `app/evaluations/page.jsx`
- `app/evaluations/components/EvaluationCard.jsx`

### 3. Limpieza de Código Temporal
- Eliminar `useTranslatedContent` si ya no es necesario (las columnas ya vienen traducidas del backend)
- Eliminar hardcodeos en `layout.jsx` líneas 18-22 cuando projects tenga columnas _es/_en

## 📋 Entidades con Columnas Multi-idioma (Backend)

### ✅ Ya migradas (columnas antiguas eliminadas):
- **tramos**: name_es, name_en, description_es, description_en, eligibility_rule_es, eligibility_rule_en
- **pacs**: title_es, title_en, objective_line_es, objective_line_en
- **categories**: name_es, name_en, description_es, description_en
- **rubrics**: name_es, name_en, description_es, description_en
- **micro_action_definitions**: instruction_es, instruction_en

### ⏳ Pendiente migrar:
- **projects**: projectName, tagline, shortDescription

## 🎯 Siguientes Pasos

1. **Migrar tabla projects** en el backend (agregar columnas name_es, name_en, tagline_es, tagline_en, shortDescription_es, shortDescription_en)

2. **Actualizar componentes de projects** usando el hook `useLocalizedField`:
   ```javascript
   const projectName = useLocalizedField(project, 'name');
   const projectTagline = useLocalizedField(project, 'tagline');
   const projectDescription = useLocalizedField(project, 'shortDescription');
   ```

3. **Probar con ambos idiomas** (ES/EN) para verificar que los campos se muestran correctamente

4. **Eliminar código temporal**:
   - Hardcodeos en layout.jsx
   - useTranslatedContent si ya no es necesario

## 🔧 Uso del Hook

```javascript
import { useLocalizedField } from '@/hooks/useLocalizedField';

// En un componente React
function MiComponente({ tramo }) {
  const tramoName = useLocalizedField(tramo, 'name');
  const tramoDescription = useLocalizedField(tramo, 'description');
  
  return <h1>{tramoName}</h1>;
}

// Fuera de componentes (usando la función utilitaria)
import { getLocalizedValue } from '@/hooks/useLocalizedField';

const name = getLocalizedValue(tramo, 'name', 'es');
```

## 📝 Notas

- El hook maneja automáticamente el fallback: idioma actual → inglés → campo original
- El idioma del usuario se obtiene de `useUserStore`
- No es necesario modificar el backend para las entidades ya migradas
- Para projects, se requiere migración del backend primero
