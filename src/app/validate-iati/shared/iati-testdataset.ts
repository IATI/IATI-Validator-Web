export interface IatiTestDataset {
  id: string;
  name: string;
  type: string;
  url: string;
  md5: string;
  tmpworkspaceId: string;
  uploaded: Date;
  filename: string;
  fileid: string;
  sourceUrl?: string;
  status?: string; // TODO: find out actual type of this field - this was infered
  'feedback-updated': Date;
  'svrl-updated': Date;
  'json-updated': Date;
}
