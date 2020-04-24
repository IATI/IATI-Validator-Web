import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { last, retry } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileUploadService {
  private urlApiFileUpUpload: string = window.__env.apiDataworkBench + '/iati-testfiles/file/source';
  private urlApiUrlsUpload: string = window.__env.apiDataworkBench + '/iati-testfiles/url/source';
  private urlApiTestworkspace: string = window.__env.apiDataworkBench + '/iati-testworkspaces';

  workspaceId = '';

  constructor(
    private readonly http: HttpClient,
  ) { }

  checkWorkspaceId(tmpWorkspaceId?: string): Observable<HttpResponse<any>> {
    if (!tmpWorkspaceId) {
      // create a new iati-testworkspace
      console.log('new workspace');
      const req = new HttpRequest('POST', this.urlApiTestworkspace, '{}');

      return this.http.request(req).pipe(
        last(),
        retry(3)
      ) as any;
    } else {
      // check existing workspace
      console.log('existing workspace');
      const req = new HttpRequest('GET', this.urlApiTestworkspace + '/' + tmpWorkspaceId);

      return this.http.request(req).pipe(
        last(),
        retry(3)
      ) as any;
    }
  };

  uploadFile(file: File, tmpWorkspaceId?: string): Observable<HttpResponse<any>> {
    if (!file) {
      return;
    }

    const url = tmpWorkspaceId ? `${this.urlApiTestworkspace}/${tmpWorkspaceId}/file/source` : this.urlApiFileUpUpload;
    const uploadData = new FormData();
    uploadData.append('files', file, file.name);

    const req = new HttpRequest('POST', url, uploadData);

    return this.http.request(req).pipe(
      last(),
      retry(3)
    ) as any;
  }

  fetchFileByUrl(urls: string, tmpWorkspaceId?: string) {
    const url = tmpWorkspaceId ? `${this.urlApiUrlsUpload}?tmpWorkspaceId=${tmpWorkspaceId}` : this.urlApiUrlsUpload;

    return this.http.post<any>(url, JSON.stringify({
      url: urls
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json'
    });
  }

  setWorkspaceId(id: string) {
    this.workspaceId = id;
  }
}
