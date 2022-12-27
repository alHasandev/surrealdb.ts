import { safeValue } from './core/helpers';
import { Obj } from './core/data.types';
import { Asign, AsignOptions, asignOptions } from './entry';

export function entriesToQuery<
  TData extends Obj | ((asign: AsignOptions) => Obj)
>(data: TData, separator: '=' | ':') {
  let entries: string[];
  if (typeof data === 'function') {
    const values = data(asignOptions);

    entries = Object.entries(values).map(([key, value]) => {
      if (value instanceof Asign) return `${key}${value}`;
      return `${key}${separator}${safeValue(value)}`;
    });
  } else {
    entries = Object.entries(data).map(([key, value]) => {
      return `${key}${separator} ${safeValue(value)}`;
    });
  }

  return entries.join(', ');
}
