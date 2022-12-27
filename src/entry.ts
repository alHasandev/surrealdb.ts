import { safeValue } from './core/helpers';
import { Query } from './core/query';
import { AsignOperator } from './operator.types';

export class Asign<TValue> extends Query<[AsignOperator, TValue]> {
  constructor(asignator: AsignOperator, value: TValue) {
    super(`${asignator} ${safeValue(value)}`);
  }
}

export const asignOptions = {
  add: <TValue>(value: TValue) => new Asign('+=', value),
  subtract: <TValue>(value: TValue) => new Asign('-=', value),
  value: <TValue>(value: TValue) => new Asign('=', value),
};

export type AsignOptions = {
  add<TValue>(value: TValue): Asign<TValue>;
  subtract<TValue>(value: TValue): Asign<TValue>;
  value<TValue>(value: TValue): Asign<TValue>;
};
