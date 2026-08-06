export default function EvaluationFilters({ search, setSearch }) {
  return (
    <div className="flex items-center gap-4">
      <input
        type="text"
        placeholder="Buscar por proyecto, autor o evidencia..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          px-4
          py-3
          outline-none
          bg-background
        "
      />
    </div>
  );
}
