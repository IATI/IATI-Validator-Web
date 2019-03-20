export interface IatiTestdataset {
  id: string;
  name: string;
  type: string;
  url: string;
  md5: string;
  tmpworkspaceId: string;
  uploaded: Date;
  filename: string;
  'feedback-updated': Date;
  'svrl-updated': Date;
  'json-updated': Date;
}
