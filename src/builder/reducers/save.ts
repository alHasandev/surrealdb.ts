import { ResponseError } from '../../core/error';
import { safeValue } from '../../core/helpers';
import { entriesToQuery } from '../../entries';
import { CreateOptions, UpdateOptions } from '../options.types';
import { lastReducer } from './last';
import { whereReducer } from './where';

export const saveReducer = (
  table: string,
  options: CreateOptions | UpdateOptions
) => {
  let saveOptions: CreateOptions['create'] | UpdateOptions['update'];
  if (options.statement === 'CREATE') {
    saveOptions = options.create;
  } else {
    saveOptions = options.update;
  }

  if (!saveOptions)
    throw new ResponseError({
      code: 400,
      details: 'Create statement must specify @data',
    });

  const [idOrData] = saveOptions;

  let method = 'CONTENT';
  let id = '';
  let value: string = '';
  if (!idOrData) method = 'SET';

  if (typeof idOrData === 'string') {
    id = `:${idOrData}`;
  }

  if (typeof idOrData === 'object') {
    value = safeValue(idOrData);
  }

  if (method === 'SET') {
    if (!options.set)
      throw new ResponseError({
        code: 400,
        details: 'Set method must have value',
      });

    let [setValue] = options.set;
    if (!setValue)
      throw new ResponseError({
        code: 400,
        details: 'Set method must have value',
      });

    value = entriesToQuery(setValue, '=');
  }

  const content = `${method} ${value}`;

  const constraints = whereReducer(options.where);

  const query = `${
    options.statement
  } ${table}${id} ${content} ${constraints.join(' ')} ${lastReducer(options)}`;

  return query;
};
