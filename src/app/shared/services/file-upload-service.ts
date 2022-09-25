import { DocumentDTO } from '../../document-list/document.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiPaths } from 'src/app/api-paths';
import { environment } from 'src/environments/environment';

export interface FileUploadResponse {
  url_to_file: string;
  content_type: string;
  content_size: number;
  original_file_name: string;
}
@Injectable({ providedIn: 'root' })
export class FileUploadService {
  constructor(private httpClient: HttpClient) {}

  upload(file: File, id: string) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient.post<FileUploadResponse>(environment.baseUrl + ApiPaths.DocumentUpload + '/' + id, formData);
  }

  download(id: string) {
    return this.httpClient.get(environment.baseUrl + ApiPaths.DocumentDownload + '/' + id, { responseType: 'blob' });
  }
}
