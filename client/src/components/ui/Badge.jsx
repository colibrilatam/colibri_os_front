const trancheStyleMap = {
  "Tramo activo": "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  "Sin tramo": "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

const statusStyleMap = {
  active: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  solid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  risk: "bg-red-500/15 text-red-300 border-red-500/30",
  paused: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  completed: "bg-violet-500/15 text-violet-300 border-violet-500/30",
};

function getBadgeLabel(value, variant) {
  if (variant === "status") {
    const statusLabelMap = {
      active: "Activo",
      solid: "Sólido",
      risk: "En riesgo",
      paused: "Pausado",
      completed: "Completado",
    };

    return statusLabelMap[value] || value || "Sin estado";
  }

  if (variant === "tranche") {
    return value || "Sin tramo";
  }

  return value;
}

export function Badge({ value, variant }) {
  const isTrancheVariant = variant === "tranche";
  const fallbackStyle = "bg-white/10 text-white/60 border-white/20";

  const badgeStyleClass = isTrancheVariant
    ? trancheStyleMap[value] ?? fallbackStyle
    : statusStyleMap[value] ?? fallbackStyle;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.01em] ${badgeStyleClass}`}
    >
      {getBadgeLabel(value, variant)}
    </span>
  );
}