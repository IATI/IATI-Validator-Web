import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { last, retry } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileUploadService {
  private urlApiFileUpUpload: string = window.__env.apiDataworkBench + '/iati-testfiles/file/source';
  private urlApiUrlsUpload: string = window.__env.apiDataworkBench + '/iati-testfiles/urls/source';

  workspaceId = '';

  constructor(
    private readonly http: HttpClient,
  ) { }


  uploadFile(file: File, tmpWorkspaceId?: string): Observable<HttpResponse<any>> {
    if (!file) {
      return;
    }

    const url = tmpWorkspaceId ? `${this.urlApiFileUpUpload}?tmpWorkspaceId=${tmpWorkspaceId}` : this.urlApiFileUpUpload;
    const uploadData = new FormData();
    uploadData.append('files', file, file.name);

    const req = new HttpRequest('POST', url, uploadData);

    return this.http.request(req).pipe(
      last(),
      retry(3)
    ) as any;
  }

  fetchFilesByUrls(urls: string[]) {
    return this.http.post<any>(this.urlApiUrlsUpload, JSON.stringify({
      urls
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json'
    })
    .subscribe((res) => {
      console.log('res: ', res);
    });
  }

  setWorkspaceId(id: string) {
    this.workspaceId = id;
  }
}
