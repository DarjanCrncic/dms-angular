import { ApiPaths } from './../../api-paths';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface TypeDTO {
  id: string;
  type_name: string;
  creation_date: Date;
  modify_date: Date;
}
@Injectable({ providedIn: 'root' })
export class DocumentTypeService {
  constructor(private httpClient: HttpClient) {}

  getAllDocumentTypes() {
    return this.httpClient.get<TypeDTO[]>(environment.baseUrl + ApiPaths.DocumentType);
  }
}
