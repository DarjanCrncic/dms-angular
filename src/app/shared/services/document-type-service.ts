import { ApiPaths } from './../../api-paths';
import { TypeDTO } from './../type.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class DocumentTypeService {
  constructor(private httpClient: HttpClient) { }
  
  getAllDocumentTypes() {
    return this.httpClient.get<TypeDTO[]>(environment.baseUrl + ApiPaths.DocumentType);
  }
}