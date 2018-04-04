export interface UploadResponse {
  filename: string;
  id: string;
  tmpworkspaceId: string;
  type: string;
  uploaded: Date | string;
  url: string;
}
