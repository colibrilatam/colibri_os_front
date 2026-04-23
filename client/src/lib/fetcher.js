import { useUserStore } from "@/lib/store";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function fetcher(endpoint, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Obtener token desde Zustand fuera de un componente
  const token = useUserStore.getState().token;

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
    useUserStore.getState().logout(); // limpiar el store
    //window.location.href = '/login';
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
console.log("ERROR EN FETCHER OBTENIENDO INFO",error);
    // Error de red, timeout, etc.
    throw new ApiError('Error de conexión con el servidor', 0, null);
  }
}