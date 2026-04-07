export default function NftAvatar({ size = "sm" }) {
  const isLarge = size === "lg";

  return (
    <div
      className={[
        "relative flex items-center justify-center rounded-full border bg-slate-950",
        isLarge
          ? "h-64 w-64 border-cyan-800/50 shadow-[0_0_80px_rgba(34,211,238,0.08)]"
          : "h-14 w-14 border-cyan-800/40 shadow-[0_0_24px_rgba(34,211,238,0.08)]",
      ].join(" ")}
    >
      <div
        className={[
          "absolute rounded-full border border-emerald-800/40",
          isLarge ? "h-52 w-52" : "h-10 w-10",
        ].join(" ")}
      />
      <div
        className={[
          "absolute rounded-full border border-cyan-700/30",
          isLarge ? "h-40 w-40" : "h-8 w-8",
        ].join(" ")}
      />
      <div className="relative flex flex-col items-center">
        <div className={isLarge ? "text-6xl" : "text-xl"}>🕊️</div>
      </div>
    </div>
  );
}
