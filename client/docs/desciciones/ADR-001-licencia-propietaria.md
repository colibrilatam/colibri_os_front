# ADR-001 — Licencia propietaria para `colibri_os_front`

| Campo | Valor |
|---|---|
| ID | ADR-001 |
| Estado | Aceptada |
| Fecha | 2026-10-02 |
| Ticket | DOC-002 |
| Aprobación | Founder (pendiente de firma) |
| Alcance | `colibri_os_front` únicamente |

## Contexto

El repositorio `colibri_os_front` es **público** en GitHub y no contiene
un archivo `LICENSE`. `client/package.json` tampoco declara el campo
`"license"`. Esta ausencia genera incertidumbre jurídica: quien accede
al código no tiene claridad sobre qué puede o no hacer con él.

Adicionalmente, el repositorio no cuenta con un canal definido para
reportar vulnerabilidades de seguridad, ni con una política de
divulgación.

El backend (`colibri_os_back`) ya declaró `"license": "UNLICENSED"` en
su `package.json` y adoptó un texto de licencia propietaria con
copyright de Colibrí Latam.

## Decisión

Adoptar una **licencia propietaria "todos los derechos reservados"**
para `colibri_os_front`, alineada con la del backend.

- **Titular:** Colibrí Latam.
- **Año:** 2026.
- **SPDX equivalente:** `UNLICENSED`.
- **Documento vinculante:** `LICENSE` en la raíz del repositorio.
- **Marca:** la marca "Colibrí" y su logo **no** se licencian por este
  documento. Requieren autorización aparte.

Adicionalmente, se incorpora un `SECURITY.md` en la raíz que define:

- Alcance de la política.
- Versión soportada (`main` únicamente).
- Canal privado de reporte (`movimientocolibrilatam@gmail.com`).
- SLAs (48h acuse / 7 días evaluación).
- Divulgación privada, sin CVE público ni crédito.

## Alternativas consideradas y descartadas

| Alternativa | Por qué se descartó |
|---|---|
| MIT / Apache-2.0 | El equipo no busca explotación externa del código. |
| AGPL-3.0 | Copyleft no aplica a un producto propietario. |
| Sin `LICENSE` (statu quo) | Ambientes públicos sin licencia generan incertidumbre. |
| `LICENSE` solo en `client/` | GitHub no lo detectaría al nivel del repositorio. |
| Doble licencia (dual) | Sin interés comercial externo actual. |

## Consecuencias

**Positivas**

- Claridad jurídica para quien clona el repositorio.
- Alineación con el backend.
- Canal formal para reportar vulnerabilidades.
- Trazabilidad de la decisión.

**Negativas / trade-offs**

- Al ser propietaria, no se puede cumplir con criterios OSI.
- La cláusula "todos los derechos reservados" impide forks abiertos
  legítimos. Los forks en GitHub existen técnicamente pero quedan sin
  licencia de uso.
- Requiere mantener vivo el canal de reporte (que hoy no tiene un equipo
  dedicado, solo la casilla de correo).

## Aprobación

| Rol | Nombre | Fecha |
|---|---|---|
| Founder / representante legal | — | — pendiente — |

Una vez firmada, esta ADR queda como referencia canónica para
`colibri_os_front` y para futuros repositorios de la organización.

## Referencias

- `LICENSE` (raíz del repositorio).
- `SECURITY.md` (raíz del repositorio).
- `client/package.json` (campo `"license"`).
- Documentación legacy: `Deuda-tecnica-frontend.md`.