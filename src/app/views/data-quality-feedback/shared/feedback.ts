/* eslint-disable @typescript-eslint/naming-convention */
import { Summary } from 'src/app/shared/summary';

export interface Ruleset {
  src: string;
  severity: string;
}

export interface Context {
  text: string;
}

export interface Message {
  id: string;
  // text: string;
  message: string;
  severity: string;
  // rulesets: Ruleset[];
  context: Context[];
}

export interface Feedback {
  category: string;
  label?: string;
  // messages: Message[];
  errors: Message[];
}

export interface Activity {
  title: string;
  identifier: string;
  publisher?: string;
  // feedback: Feedback[];
  errors: Feedback[];
}

export interface Dqfs {
  activities: Activity[];
  feedback: Feedback[];
  organisations: Activity[];
  filetype: string;
  schemaVersion: string;
  iatiVersion: string;
  feedbackUpdated: string;
  filename: string;
}

export interface Report {
  valid: boolean;
  fileType: string;
  iatiVersion: string;
  summary: Summary;
  errors: Activity[];
}

export interface ReportResponse {
  document_url: string;
  registry_hash: string;
  registry_id: string;
  valid: boolean;
  report: Report;
}
