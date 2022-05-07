import { Observable } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { ApiPaths } from './../api-paths';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentDTO } from './document.model';

@Injectable({providedIn: 'root'})
export class DocumentService {
  constructor(private httpClient: HttpClient) { }
  
  getDocuments(sort: Sort): Observable<DocumentDTO[]> {
    return this.httpClient.get<DocumentDTO[]>(environment.baseUrl + ApiPaths.Document, {
      params: {
        active: sort.active,
        direction: sort.direction
      }
    });
  }

  deleteDocuments(documents: string[]) {
    console.log(documents.flat())
    return this.httpClient.delete(environment.baseUrl + ApiPaths.Document, {
      params: {
        ids: documents.flat()
      }
    })
  }
}