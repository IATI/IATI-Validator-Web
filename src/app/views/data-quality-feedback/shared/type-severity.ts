import { TypeMessage } from './type-message';

export interface TypeSeverity {
  severity: string;
  order: number;
  types: TypeMessage[];
  show: boolean;
  count?: number;
}
