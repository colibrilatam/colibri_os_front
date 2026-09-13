Informe de Deuda Técnica y Problema de Inicio de Sesión con Google
Repositorio: colibri_os_front
Fecha: $(date)
Autor: Nexus (Code Analysis Agent)

1. Problema identificado: Inicio de sesión con Google desactivado
Archivo	Línea	Observación
client/src/app/login/page.jsx	131	El <GoogleButton /> está comentado ({/*<GoogleButton />*/}), lo que impide que los usuarios vean el botón de login con Google.
client/src/components/login/GoogleButton.jsx	3‑11	El componente existe y redirige correctamente a ${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google.
client/src/app/login/google-callback/page.jsx	19‑145	Ruta de callback implementada para manejar la respuesta de OAuth (selección de rol, finalización de perfil).
Impacto: Alto – los usuarios no pueden iniciar sesión con su cuenta de Google.

2. Deuda técnica encontrada
2.1 Falta de manejo de errores en el callback de Google
Archivo: client/src/app/login/google-callback/page.jsx
Líneas: 30‑48
Detalle: El efecto que llama a checkAuth() no tiene un .catch(). Si la promesa falla (error de red, token inválido, etc.), el usuario queda atrapado en el estado “Iniciando sesión…” sin retroalimentación.
2.2 console.log activos de depuración
Archivo: client/src/app/dashboard/[id]/trayectoria/NewPage.jsx
Líneas: 310 (console.log(err);) y 747 (console.log(microActions);)
Detalle: Sentencias de logging dejadas por depuración que generan ruido en los logs de producción.
2.3 Código comentado que genera ruido
Archivo: client/src/app/login/page.jsx
Importación y uso de GoogleButton comentados (líneas 8 y 131).
Archivo: client/src/app/dashboard/[id]/trayectoria/NewPage.jsx
Varias líneas console.log comentadas (líneas 41, 45, 251).
2.4 Comentarios tipo TODO vagos
Archivos:
client/src/app/globals.css (líneas 141, 899)
client/src/app/home/page.jsx (líneas 85, 107, 158, 163, 168)
Detalle: Comentarios como “todo corrido un nivel arriba” o “Ej: …” que no indican una acción concreta y aumentan la carga cognitiva.
3. Evaluación de riesgo
Ítem	Impacto	Probabilidad	Nivel de riesgo
Botón de Google comentado	Alto	Cierta	Alto
Falta de .catch() en callback	Medio	Posible	Medio
console.log activos	Bajo‑medio	Cierta	Bajo‑medio
Código comentado	Bajo	Cierta	Bajo
Comentarios vagos	Bajo	Cierta	Bajo
4. Plan de acción / Soluciones propuestas
#	Acción	Detalle	Archivo(s) afectado(s)	Comentario
1	Activar el botón de Google	Descomentar {/*<GoogleButton />*/} y su importación correspondiente.	client/src/app/login/page.jsx	Restaura la funcionalidad de login con Google.
2	Añadir manejo de errores al callback	Encadenar .catch() al efecto que llama a checkAuth() y redirigir a una página de error o mostrar un mensaje.	client/src/app/login/google-callback/page.jsx	Evita estados de carga infinita y mejora la UX.
3	Eliminar console.log de depuración	Borrar o comentar las líneas console.log(err); (línea 310) y console.log(microActions); (línea 747).	client/src/app/dashboard/[id]/trayectoria/NewPage.jsx	Reduce ruido en logs de producción.
4	Limpiar código comentado	Revisar y eliminar bloques de código comentado que no sirvan como documentación (import/uso de GoogleButton, console.log comentados).	client/src/app/login/page.jsx, client/src/app/dashboard/[id]/trayectoria/NewPage.jsx	Mejora legibilidad y mantenibilidad.
5	Reemplazar comentarios vagos por TODOs accionables	Convertir comentarios como “todo corrido un nivel arriba” en // TODO: mover X un nivel arriba o eliminarlos si ya no son relevantes.	client/src/app/globals.css, client/src/app/home/page.jsx	Facilita el seguimiento de tareas pendientes.
5. Checklist de implementación
 Descomentar <GoogleButton /> y su import en login/page.jsx.
 Añadir .catch() al efecto de checkAuth() en login/google-callback/page.jsx.
 Eliminar los dos console.log activos en NewPage.jsx.
 Limpiar código comentado en los archivos indicados.
 Revisar y actualizar los comentarios vagos a TODOs claros o eliminarlos.
 Ejecutar la suite de pruebas para asegurarse de que no se introducen regresiones.
 Verificar en entorno de staging que el flujo de login con Google funciona correctamente y que los logs de producción están limpios.
6. Conclusión
El principal bloqueo para el inicio de sesión con Google es la presencia de código comentado que desactiva el botón. Además, la falta de manejo de errores en el callback y los restos de depuración generan deuda técnica que afecta la confiabilidad y la mantenibilidad del proyecto. Aplicando las soluciones propuestas se restaurará la funcionalidad esperada, se mejorará la experiencia del usuario y se reducirá la deuda técnica acumulada.

Fin del informe.
