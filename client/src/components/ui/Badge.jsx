const trancheStyleMap = {
  T1: "bg-blue-500/20 text-blue-300 border-blue-400/60",
  T2: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  T3: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  T4: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  "Sin tramo": "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

const statusStyleMap = {
  active: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  inactive: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  closed: "bg-red-500/15 text-red-300 border-red-500/30",
  suspended: "bg-violet-500/15 text-violet-300 border-violet-500/30",
};

function getBadgeLabel(value, variant) {
  if (variant === "status") {
    const statusLabelMap = {
      active: "Activo",
      inactive: "Inactivo",
      closed: "Cerrado",
      suspended: "Suspendido",
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