import { QueryBuilder } from './builder';
import { SurrealDB } from './db.types';
import { DatabaseSchema } from './schema.types';

export type SurrealProxy<
  DBHandler extends SurrealDB<DatabaseSchema>,
  DBSchema extends DatabaseSchema = DBHandler extends SurrealDB<infer DB>
    ? DB extends DatabaseSchema
      ? DB
      : DatabaseSchema
    : DatabaseSchema
> = {
  [K in keyof DBSchema as K extends string ? K : never]: K extends string
    ? QueryBuilder<DBHandler, K, DBSchema, DBSchema[K]>
    : never;
};
