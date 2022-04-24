import { PageData } from './../shared/page-data.interface';
import { ApiPaths } from './../api-paths';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Document } from './document.model';
import { PageResponse } from '../shared/page-response.interface';

@Injectable({providedIn: 'root'})
export class DocumentService {
  constructor(private httpClient: HttpClient) { }
  
  getDocuments(page: PageData) {
    return this.httpClient.get<PageResponse>(environment.baseUrl + ApiPaths.Document, {
      params: {
        pageIndex: page.pageIndex,
        pageSize: page.pageSize,
      }
    });
  }
}