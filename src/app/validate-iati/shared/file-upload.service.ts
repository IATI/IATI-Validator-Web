import { HttpClient, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { last, retry } from 'rxjs/operators';

@Injectable()
export class FileUploadService {
  workspaceId = '';
  private urlApiFileUpUpload: string = window.__env.apiDataworkBench + '/iati-testfiles/file/source';
  private urlApiUrlsUpload: string = window.__env.apiDataworkBench + '/iati-testfiles/url/source';
  private urlApiTestWorkspace: string = window.__env.apiDataworkBench + '/iati-testworkspaces';

  constructor(
    private readonly http: HttpClient,
  ) { }

  checkWorkspaceId(tmpWorkspaceId?: string): Observable<HttpResponse<any>> {
    if (!tmpWorkspaceId) {
      // create a new iati-testworkspace
      const req = new HttpRequest('POST', this.urlApiTestWorkspace, '{}');

      return this.http.request(req).pipe(
        last(),
        retry(3)
      ) as any;
    } else {
      // check existing workspace
      const req = new HttpRequest('GET', this.urlApiTestWorkspace + '/' + tmpWorkspaceId);

      return this.http.request(req).pipe(
        last(),
        retry(3)
      ) as any;
    }
  }

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
      JSON.stringify({ url: fileUrl }),
      {
        headers: {
          'Content-Type': 'application/json' // eslint-disable-line @typescript-eslint/naming-convention
        },
        responseType: 'json'
      }
    );
  }

  setWorkspaceId(id: string) {
    this.workspaceId = id;
  }
}
