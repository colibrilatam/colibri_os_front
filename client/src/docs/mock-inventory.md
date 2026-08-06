# Inventario de funcionalidades

## Estados

- REAL: utiliza únicamente datos del backend.
- PARTIAL: mezcla datos reales y simulados.
- DEMO: disponible únicamente para demostraciones.
- MOCK: utiliza exclusivamente datos simulados.
- PLANNED: aún no implementado.

---

| Funcionalidad    | Estado  | Fuente                  | Observaciones                                  |
| ---------------- | ------- | ----------------------- | ---------------------------------------------- |
| Login            | REAL    | Backend                 | JWT                                            |
| Registro         | REAL    | Backend                 |                                                |
| Usuarios         | REAL    | Backend                 |                                                |
| Proyectos        | REAL    | Backend                 |                                                |
| Tramos           | REAL    | Backend                 |                                                |
| Evidencias       | REAL    | Backend                 |                                                |
| Microacciones    | REAL    | Backend                 |                                                |
| NFT              | REAL    | Backend                 |                                                |
| Dashboard        | PARTIAL | Backend + Mock          | Algunos widgets siguen usando datos simulados. |
| Trayectoria      | PARTIAL | Backend + Mock          | Flujo T4 utiliza datos ficticios.              |
| Reputación       | PARTIAL | Backend + cálculo local | Pendiente migrar completamente al backend.     |
| Tutorial Onborda | DEMO    | Local                   | Solo onboarding.                               |
| Flujo Tramo 4    | DEMO    | JSON                    | Simulación completa.                           |
| IA Evaluación    | PLANNED | -                       | No implementada.                               |
