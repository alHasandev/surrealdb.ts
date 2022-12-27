import { RecordData } from './core/data.types';

export type DatabaseSchema = { [TableName: string]: RecordData };

export type NamespaceSchema = {
  [DBName: string]: DatabaseSchema;
};

export type SurrealSchema = {
  [NSName: string]: NamespaceSchema;
};
