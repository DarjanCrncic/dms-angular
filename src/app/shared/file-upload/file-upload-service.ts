import { FileUploadResponse } from './file-upload-response.interface';
import { DocumentDTO } from './../../document-list/document.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiPaths } from 'src/app/api-paths';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  constructor(private httpClient: HttpClient) {}

  upload(file: File, document: DocumentDTO) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient.post<FileUploadResponse>(
      environment.baseUrl + ApiPaths.DocumentUpload + '/' + document.id,
      formData
    );
  }

  download(document: DocumentDTO) {
    return this.httpClient.get(
      environment.baseUrl + ApiPaths.DocumentDownload + '/' + document.id,
      { responseType: 'blob' }
    );
  }
}
