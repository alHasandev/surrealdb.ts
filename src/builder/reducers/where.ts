import { Where } from '../where';
import { RecordData } from '../../core/data.types';
import { ComparisonOperator } from '../../operator.types';
import { Group } from '../group';
import { Query } from '../../core/query';
import { createRecordRef, RefProxy } from '../../ref';

export type WhereCallback = (
  constraint: (
    field: string,
    comparator: ComparisonOperator,
    value: unknown
  ) => Where<RecordData, string>,
  group: (query: Query<boolean>) => Group<Query<boolean>>,
  ref: RefProxy<RecordData>
) => Query<boolean>;

export type WhereKey = string | WhereCallback;

export const whereReducer = (
  args?: [WhereKey, ComparisonOperator | undefined, unknown]
) => {
  const constraints: string[] = [];

  if (args) {
    const [keyOrFunc, comparator, value] = args;

    const where = (
      field: string,
      comparator: ComparisonOperator,
      value: unknown
    ) => new Where(field, comparator, value);

    if (typeof keyOrFunc === 'function') {
      const group = (query: Query<boolean>) => new Group(query);
      const ref = createRecordRef();

      constraints.push(`WHERE ${keyOrFunc(where, group, ref)}`);
    } else if (keyOrFunc && comparator && value !== undefined) {
      constraints.push(`WHERE ${where(keyOrFunc, comparator, value)}`);
    }
  }

  return constraints;
};
