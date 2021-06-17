/* eslint-disable @typescript-eslint/naming-convention */
import { Workspace } from './workspace';
import { Document } from './document';

export interface Organisation {
  org_id: string;
  name: string;
  description: string;
  title: string;
  state: string;
  image_url: string;
  country_code: string;
  iati_id: string;
  package_count: number;
  workspaces: Workspace[];
  documents: Document[];
}
