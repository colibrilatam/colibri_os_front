
export default function DashboardHome() {
  // PRUEBA DE ERROR: Descomentar la siguiente línea para activar el error screen
  // throw new Error('Error de prueba en el dashboard');

  return (
    <div className="flex flex-col gap-6">
      
      {/* Saludo */}
      <section className="bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold">
          Hola 👋
        </h1>
        <p className="text-gray-600">
          Este es tu resumen general
        </p>
      </section>

      {/* Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">Identidad</div>
        <div className="bg-white p-4 rounded-xl shadow">Ruta de vuelo</div>
        <div className="bg-white p-4 rounded-xl shadow">Competencias</div>
      </section>

    </div>
  );
}