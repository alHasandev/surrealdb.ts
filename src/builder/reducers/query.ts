import { ResponseError } from '../../core/error';
import { ExecOptions } from '../options.types';
import { selectReducer } from './select';
import { saveReducer } from './save';
import { insertReducer } from './insert';
import { deleteReducer } from './delete';

export const queryReducer = (table: string, options: ExecOptions) => {
  switch (options.statement) {
    case 'SELECT':
      return selectReducer(table, options);
    case 'CREATE':
    case 'UPDATE':
      return saveReducer(table, options);
    case 'INSERT':
      return insertReducer(table, options);
    case 'DELETE':
      return deleteReducer(table, options);

    default:
      throw new ResponseError({
        code: 500,
        details: 'Query statement not specified',
      });
  }
};
