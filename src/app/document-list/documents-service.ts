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
  
  getDocuments(sort?: Sort, path?: string): Observable<DocumentDTO[]> {
    if (!sort) {
      sort = {
        active: 'creation_date',
        direction: 'desc',
      }
    }
    const params = {
      active: sort.active,
      direction: sort.direction,
    }

    return this.httpClient.get<DocumentDTO[]>(environment.baseUrl + ApiPaths.Document, {
      params: path ? {...params, search: "parentFolder:" + path} : params
    });
  }

  deleteDocuments(documents: string[]) {
    return this.httpClient.delete(environment.baseUrl + ApiPaths.Document, {
      params: {
        ids: [...documents]
      }
    })
  }
}