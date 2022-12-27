import { safeValue } from './core/helpers';

export function getProjections(
  selects?: readonly string[],
  selectAs?: Record<string, unknown>
) {
  let projections: string[] = ['*'];
  if (selects) {
    if (selects.length === 0 && !selectAs) selects = ['*'];
    projections = [...selects];
  }

  if (selectAs) {
    projections = projections.concat(
      Object.entries(selectAs).map(([key, value]) => {
        return `${safeValue(value)} AS ${key}`;
      })
    );
  }

  return projections;
}
