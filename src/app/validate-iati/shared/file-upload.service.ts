import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { last, retry } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  workspaceId = '';
  private apiKeyName: string = window.__env.validatorServicesKeyName;
  private apiKeyValue: string = window.__env.validatorServicesKeyValue;
  private authHeader: HttpHeaders = new HttpHeaders({ [this.apiKeyName]: this.apiKeyValue });

  constructor(private readonly http: HttpClient) {}

  uploadFile(file: File, tmpWorkspaceId?: string): Observable<HttpResponse<any>> | null {
    if (!file) {
      return null;
    }

    const url = `${window.__env.validatorServicesUrl}/pvt/adhoc/upload?sessionId=${tmpWorkspaceId}&filename=${
      file.name
    }&guid=${uuidv4()}`;
    const uploadData = new FormData();
    uploadData.append('file', file, file.name);
    {
    }
    const req = new HttpRequest('POST', url, uploadData, { headers: this.authHeader });

    return this.http.request(req).pipe(last()) as any;
  }

  fetchFileByUrl(fileUrl: string, tmpWorkspaceId?: string) {
    const url = `${
      window.__env.validatorServicesUrl
    }/pvt/adhoc/url?sessionId=${tmpWorkspaceId}&url=${fileUrl}&guid=${uuidv4()}`;
    return this.http.post<any>(url, JSON.stringify({ url: fileUrl }), { headers: this.authHeader });
  }

  setWorkspaceId(id: string) {
    this.workspaceId = id;
  }
}
