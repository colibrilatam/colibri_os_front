
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function getToken() {
  // SERVIDOR: usa next/headers dinámicamente para no romper el bundle del cliente
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value ?? null;
  }

  // CLIENTE: lee la cookie directamente del navegador
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='));
  return match ? match.split('=')[1] : null;
}

export async function fetcher(endpoint, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Obtener token desde Zustand fuera de un componente
  const token = await getToken();


  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(`${baseUrl}${endpoint}`, config);

    if (!res.ok) {
      // Token expirado o inválido — redirigir al login
  if (res.status === 401) {
    await useUserStore.getState().logout(); // limpiar el store
    console.log("token expirado o invalido");
  }

      const errorData = await res.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'Error en la solicitud',
        res.status,
        errorData
      );
    }

    // 204 No Content u otras respuestas sin body
    if (res.status === 204) return null;

    return await res.json();

  } catch (error) {
    // Re-lanza ApiError tal cual
    if (error instanceof ApiError) throw error;


    // Error de red, timeout, etc.
    throw new ApiError('Error de conexión con el servidor', 0, null);
  }
}