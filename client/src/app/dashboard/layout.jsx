import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Dashboard</h2>

        <nav className="flex flex-col gap-2">
          <Link href="/identidad">Identidad</Link>
          <Link href="/ruta-de-vuelo">Ruta de Vuelo</Link>
          <Link href="/competencias">Competencias</Link>
          <Link href="/incertidumbre">Incertidumbre</Link>
          <Link href="/trazabilidad">Trazabilidad</Link>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}