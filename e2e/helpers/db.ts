import { Client } from 'pg';

/**
 * Acceso directo a la DB del entorno E2E. Solo se usa para:
 *  - resolver IDs de recursos sembrados (proyecto B, evaluación B, usuarios).
 *  - verificar integridad tras un rechazo (que no hubo cambios).
 *  - limpieza opcional.
 *
 * La DB es efímera (tmpfs en docker compose), por lo que no hay riesgo de
 * tocar datos reales.
 */

const DATABASE_URL = process.env.E2E_DATABASE_URL;

function requireDatabaseUrl(): string {
  if (!DATABASE_URL) {
    throw new Error('E2E_DATABASE_URL no está definida (.env.e2e).');
  }
  return DATABASE_URL;
}

export async function dbQuery<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const client = new Client({ connectionString: requireDatabaseUrl() });
  await client.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows as T[];
  } finally {
    await client.end();
  }
}

export async function getProjectIdByName(projectName: string): Promise<string> {
  const rows = await dbQuery<{ id: string }>('SELECT id FROM projects WHERE project_name = $1', [
    projectName,
  ]);
  if (!rows[0]) throw new Error(`Proyecto no encontrado en la DB E2E: ${projectName}`);
  return rows[0].id;
}

export async function getUserIdByEmail(email: string): Promise<string> {
  const rows = await dbQuery<{ id: string }>('SELECT id FROM users WHERE email = $1', [email]);
  if (!rows[0]) throw new Error(`Usuario no encontrado en la DB E2E: ${email}`);
  return rows[0].id;
}

export async function getEvaluationIdByProjectName(projectName: string): Promise<string> {
  const rows = await dbQuery<{ id: string }>(
    `SELECT e.id
       FROM evaluations e
       JOIN evidences ev ON ev.id = e.evidence_id
       JOIN projects p ON p.id = ev.project_id
      WHERE p.project_name = $1
      LIMIT 1`,
    [projectName],
  );
  if (!rows[0]) throw new Error(`Evaluación no encontrada para el proyecto: ${projectName}`);
  return rows[0].id;
}

export async function truncateAll(): Promise<void> {
  const tables = await dbQuery<{ tablename: string }>(`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename NOT IN ('migrations')
  `);
  if (tables.length === 0) return;
  const list = tables.map((table) => `"${table.tablename}"`).join(', ');
  await dbQuery(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`);
}
