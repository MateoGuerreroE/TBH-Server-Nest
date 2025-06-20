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
      .map(
        (update) =>
          sql`WHEN ${sql.param(update[idKey])} THEN ${typeof update[field] === 'number' ? sql.raw(`${update[field]}`) : sql.param(update[field as keyof T])}`,
      );

    fieldCases[field] =
      sql`CASE "${sql.raw(String(idKey))}" ${sql.join(cases, sql.raw(' '))} ELSE ${sql.raw(`"${field}"`)} END`;
  }

  const setClauses = Object.entries(fieldCases).map(
    ([field, caseSql]) => sql`${sql.raw(`"${field}"`)} = ${caseSql}`,
  );

  setClauses.push(sql`${sql.raw(`"updatedBy"`)} = ${sql.param(updatedBy)}`);
  setClauses.push(
    sql`${sql.raw(`"updatedAt"`)} = ${sql.raw('CURRENT_TIMESTAMP')}`,
  );

  return sql`
    UPDATE ${sql.raw(table)}
    SET ${sql.join(setClauses, sql`, `)}
    WHERE "${sql.raw(String(idKey))}" IN (${sql.join(ids, sql`, `)})
  `;
}
