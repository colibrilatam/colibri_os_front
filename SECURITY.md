# Política de seguridad

## Alcance

Este documento aplica únicamente al repositorio **`colibri_os_front`**
(aplicación cliente web de Colibrí). El backend (`colibri_os_back`) tiene
su propia política en su repositorio.

Fuera de alcance:

- Infraestructura, dominios y DNS.
- API backend.
- Servicios de terceros (Cloudinary, Google OAuth, Dokploy).
- Ingeniería social, ataques físicos y DoS volumétrico.
- Vulnerabilidades en dependencias ya reportadas upstream.

## Versiones soportadas

| Versión | Soportada |
|---|---|
| `main` | ✅ |
| Ramas `feat/*`, `dev`, `fix/*` | ❌ |
| Commits / tags antiguos | ❌ |

Solo se aplican parches de seguridad sobre `main`. No se backportean
fixes a ramas ni a tags previos.

## Cómo reportar una vulnerabilidad

> ⚠️ **No abras un issue público** para reportar problemas de seguridad.

Enviá un email a:

**movimientocolibrilatam@gmail.com**

Incluí, si es posible:

- Descripción del problema y su impacto potencial.
- Pasos para reproducirlo (PoC, capturas, requests).
- Versión, rama o commit afectado.
- Entorno donde lo observaste (navegador, sistema operativo, red).
- Cómo querés que te contactemos (si querés respuesta).

## Proceso de divulgación

| Fase | Plazo |
|---|---|
| Acuse de recibo | **48 horas** |
| Evaluación inicial y plan de mitigación | **90 días** |
| Corrección y despliegue | Según severidad y complejidad, coordinado con quien reportó |

La divulgación se mantiene **privada** hasta que exista un fix
desplegado. No se publica CVE ni se otorga crédito público al reportero.

Los anuncios internos sobre el estado de un incidente se realizan en el
servidor de Discord del proyecto.

## Reconocimiento

No ofrecemos recompensas económicas ni crédito público. Sí agradecemos
el reporte responsable por el canal indicado.

## Compromisos

- No emprenderemos acciones legales contra quien reporte de buena fe por
  el canal privado.
- Mantendremos informado a quien reportó durante el proceso.
- Documentaremos internamente cada incidente y su resolución.

## Contacto

**movimientocolibrilatam@gmail.com**