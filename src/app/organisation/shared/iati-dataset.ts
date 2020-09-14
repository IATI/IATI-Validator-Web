export interface IatiDataset {
  id: string;
  name: string;
  url: string;
  md5: string;
  publisher: string;
  filename: string;
  updated: Date;
  downloaded: Date;
  'svrl-updated': Date;
  'json-updated': Date;
}
