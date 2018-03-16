export interface TypeMessage {
  id: string;
  text: string;
  show: boolean;
  count?: number;
}

export interface TypeSeverity {
  severity: string;
  order: number;
  types: TypeMessage[];
  show: boolean;
  count?: number;
}
