import { Options } from '../options.types';

export function lastReducer(options: Pick<Options, 'timeout' | 'parallel'>) {
  const constraints: string[] = [];
  if (options.timeout) {
    const [timeout] = options.timeout;
    if (timeout > 0) constraints.push(`TIMEOUT ${timeout}ms`);
  }

  if (options.parallel) {
    constraints.push(`PARALLEL`);
  }

  return constraints.join(' ');
}
