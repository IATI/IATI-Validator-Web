export interface Version {
  slug: string;
  title: string;
}

  export interface Property {
      name: string;
      value: string;
  }

  export interface View {
      id: string;
      version_id: string;
      type_name: string;
      type: string;
      description: string;
      properties: Property[];
  }

  // export interface Version {
  //     id: string;
  //     workspace_id: string;
  //     name: string;
  //     slug: string;
  //     description: string;
  //     last_modified: Date ;
  //     views: View[];
  // }

