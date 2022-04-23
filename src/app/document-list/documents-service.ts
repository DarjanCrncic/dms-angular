import { ApiPaths } from './../api-paths';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Document } from './document.model';

@Injectable({providedIn: 'root'})
export class DocumentService {
  constructor(private httpClient: HttpClient) { }
  
  getDocuments() {
    return this.httpClient.get<Document[]>(environment.baseUrl + ApiPaths.Document);
  }
}