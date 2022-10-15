import { Observable, Subject } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { ApiPaths } from './../api-paths';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentDTO, ModifyDocumentDTO, NewDocumentDTO } from './document.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
    refreshDocuments = new Subject();

    constructor(private httpClient: HttpClient) {}

    getDocuments(sort?: Sort, parentFolderId?: string, search?: string): Observable<DocumentDTO[]> {
        if (!sort) {
            sort = {
                active: 'creation_date',
                direction: 'desc'
            };
        }
        const params = {
            active: sort.active,
            direction: sort.direction
        };
        const addition = search ? `,${search}` : '';

        return this.httpClient.get<DocumentDTO[]>(environment.baseUrl + ApiPaths.Document, {
            params: parentFolderId
                ? {
                      ...params,
                      search: `parentFolder:${parentFolderId},immutable:false${addition}`
                  }
                : params
        });
    }

    deleteDocuments(documents: string[]) {
        return this.httpClient.delete(environment.baseUrl + ApiPaths.Document, {
            params: {
                ids: [...documents]
            }
        });
    }

    patchDocument(data: ModifyDocumentDTO, id: string) {
        return this.httpClient.patch<DocumentDTO>(environment.baseUrl + ApiPaths.Document + '/' + id, data);
    }

    saveNewDocument(data: NewDocumentDTO) {
        return this.httpClient.post<DocumentDTO>(environment.baseUrl + ApiPaths.Document, data);
    }

    copyDocuments(ids: string[], parentFolderId: string) {
        return this.httpClient.post<DocumentDTO[]>(environment.baseUrl + ApiPaths.DocumentCopy, {
            documents: ids,
            folder_id: parentFolderId
        });
    }

    cutDocuments(ids: string[], parentFolderId: string) {
        return this.httpClient.post<DocumentDTO[]>(environment.baseUrl + ApiPaths.DocumentCut, {
            documents: ids,
            folder_id: parentFolderId
        });
    }

    versionDocument(id: string) {
        return this.httpClient.post<DocumentDTO>(environment.baseUrl + ApiPaths.DocumentVersion + '/' + id, {});
    }

    branchDocument(id: string) {
        return this.httpClient.post<DocumentDTO>(environment.baseUrl + ApiPaths.DocumentBranch + '/' + id, {});
    }

    getVersions(rootId: string) {
        return this.httpClient.get<DocumentDTO[]>(environment.baseUrl + ApiPaths.DocumentVersions + '/' + rootId);
    }
}
