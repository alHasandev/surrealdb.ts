import { SerializeObject } from './core/utils.types';
import { Obj } from './core/data.types';

export type OrderDirection = 'ASC' | 'DESC';

export type SelectFields<TData extends Obj> = readonly (
  | '*'
  | (keyof TData & string)
)[];

export type SelectOptions<TData extends Obj> = {
  select?: (keyof TData & string)[];
  projections?: SelectFields<TData> | Obj;
  where?: string;
  orderBy?: {
    [K in keyof TData]?: OrderDirection;
  };
  limit?: number;
  start?: number;
  timeout?: number;
  parallel?: boolean;
  fetch?: readonly (keyof SerializeObject<TData> & string)[];
};

export type Select<
  TData extends Obj,
  Selections extends string = '*',
  Projections extends Obj = {},
  Selecteds extends Obj = Pick<
    TData,
    keyof {
      [K in Selections as K extends '*' ? keyof TData : never]: K;
    }
  > & {
    [K in Selections as K extends keyof TData ? K : never]: TData[K];
  }
> = Selecteds & {
  [K in keyof Projections]: Projections[K];
};
