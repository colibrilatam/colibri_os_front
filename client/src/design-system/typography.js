export const textStyles = {
  // =========================
  // 🔹 HEADINGS (jerarquía alta)
  // =========================

  // 30px → h1 → títulos principales (nombre de proyecto, página)
  headingLg: 'text-3xl font-semibold text-slate-50',

  // 24px → h2 → títulos de sección
  headingMd: 'text-2xl font-semibold text-slate-50',

  // 20px → h3 / h4 → subtítulos o bloques importantes
  headingSm: 'text-xl font-semibold text-slate-50',

  // =========================
  // 🔹 TITLES / DESTACADOS
  // =========================

  // 18px → h4 / h5 / div → títulos internos (cards, paneles)
  title: 'text-lg font-medium text-slate-100',

  // 18px → p / span → texto destacado (preguntas, statements importantes)
  bodyLg: 'text-lg leading-relaxed text-slate-200',

  // =========================
  // 🔹 BODY (contenido)
  // =========================

  // 16px → p → texto base principal (lectura cómoda)
  bodyBase: 'text-base text-slate-200',

  // 14px → p → texto estándar de UI
  body: 'text-sm leading-6 text-slate-300',

  // 14px → p → texto más legible (más contraste, bloques importantes)
  bodyStrongAlt: 'text-sm leading-relaxed text-slate-200',

  // 14px → p / span → texto secundario
  bodyMuted: 'text-sm leading-6 text-slate-400',

  // 14px → span / p → texto importante dentro de párrafos
  bodyStrong: 'text-sm font-medium text-slate-100',

  // 14px → p / span → texto auxiliar (helpers, hints)
  helper: 'text-sm text-slate-400',

  // 14px → span → fechas, metadata suave
  subtle: 'text-sm text-slate-500',

  // =========================
  // 🔹 LABELS / UI
  // =========================

  // 12px → span / label → etiquetas UI (inputs, headers de bloques)
  label: 'text-xs uppercase tracking-[0.18em] text-slate-500',

  // 12px → span → labels más visibles (secciones importantes)
  labelStrong: 'text-xs uppercase tracking-[0.22em] text-slate-400',

  // 11px → span → labels compactos (cards densas, métricas pequeñas)
  labelXs: 'text-[11px] uppercase tracking-[0.18em] text-slate-500',

  // =========================
  // 🔹 ESPECIALES
  // =========================

  // 30px → div / span → números grandes (KPIs, métricas)
  metric: 'text-3xl font-semibold text-slate-50',

  // hereda tamaño → span → texto inline dentro de otros textos
  inlineMuted: 'text-slate-400',

  // 12px → span → metadata muy secundaria (timestamps, ids)
  meta: 'text-xs text-slate-500',
};
