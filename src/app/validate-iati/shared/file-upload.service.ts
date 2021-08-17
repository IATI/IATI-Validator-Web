import { HttpClient, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { last, retry } from 'rxjs/operators';

@Injectable()
export class FileUploadService {
  workspaceId = '';

  constructor(
    private readonly http: HttpClient,
  ) { }

  uploadFile(file: File, tmpWorkspaceId?: string): Observable<HttpResponse<any>> | null {
    if (!file) {
      return null;
    }

    const url = `${window.__env.validatorServicesUrl}/pvt/adhoc/upload?sessionId=${tmpWorkspaceId}&filename=${file.name}`;
    const uploadData = new FormData();
    uploadData.append('file', file, file.name);
{}
    const req = new HttpRequest('POST', url, uploadData);

    return this.http.request(req).pipe(
      last()
    ) as any;
  }

  fetchFileByUrl(fileUrl: string, tmpWorkspaceId?: string) {
    const url = `${window.__env.validatorServicesUrl}/pvt/adhoc/url?sessionId=${tmpWorkspaceId}&url=${fileUrl}`;
    return this.http.post<any>(
      url,
      JSON.stringify({ url: fileUrl })
    );
  }

  setWorkspaceId(id: string) {
    this.workspaceId = id;
  }
}
