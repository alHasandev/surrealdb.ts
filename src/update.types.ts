import { RecordData } from './core/data.types';

export type SaveMethod = 'CONTENT' | 'SET';

export type UpdateOptions<TData extends RecordData> = {
  method?: SaveMethod;
  data?: Partial<Omit<TData, 'id'>>;
  where?: string;
};
