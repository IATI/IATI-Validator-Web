export interface IatiTestDataset {
  filename: string;
  guid: string;
  sessionId: string;
  created: Date;
  validated: Date;
  valid: boolean;
  report: string;
  class: string;
}
