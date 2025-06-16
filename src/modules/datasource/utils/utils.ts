import { SQL, sql } from 'drizzle-orm';

export function generateBatchSQL<T extends object>(
  table: string,
  idKey: keyof T,
  updates: T[],
  updatedBy: string,
): SQL<T> {
  const ids = updates.map((entity) => entity[idKey]);
  const allFields = new Set<string>();
  updates.forEach((update) =>
    Object.keys(update).forEach((key) => {
      if (key !== idKey) allFields.add(key);
    }),
  );

  const fieldCases: Record<string, any> = {};

  for (const field of allFields) {
    const cases = updates
      .filter((update) => field in update)
      .map((update) =>
        sql.raw(
          `WHEN ${sql.param(update[idKey])} THEN ${sql.param(update[field as keyof T])}`,
        ),
      );

    fieldCases[field] = sql.raw(
      `CASE "${String(idKey)}" ${sql.join(cases, sql.raw(' '))} END`,
    );
  }

  const setClauses = Object.entries(fieldCases).map(
    ([field, caseSql]) => sql`${sql.raw(`"${field}"`)} = ${caseSql}`,
  );

  setClauses.push(sql`${sql.raw(`"updatedBy"`)} = ${sql.param(updatedBy)}`);

  return sql`
    UPDATE ${table}
    SET ${sql.join(setClauses, sql`, `)}
    WHERE ${idKey} IN (${sql.join(ids, sql`, `)})
  `;
}
