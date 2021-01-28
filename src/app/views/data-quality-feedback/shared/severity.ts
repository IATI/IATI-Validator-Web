import { TypeMessage } from './type-message';
export interface Severity {
  id: string;
  slug: string;
  name: string;
  description: string;
  count: number | null;
  order: number;
  show: boolean;
  types: TypeMessage[];
}
