import { Version } from './version';

export interface Workspace {
  slug: string;
  'owner-slug': string;
  title: string;
  description: string;
  versions: Version[];
  id: string;
  'iati-publisherId': string;
}




// export interface Workspace {
//   id: string;
//   slug: string;
//   organisation_id: string;
//   organisation_name: string;
//   title: string;
//   description: string;
// }
