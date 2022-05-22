import { FolderNode } from './folder-node.model';
import { Folder } from './folder.model';
import { ApiPaths } from './../api-paths';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentService } from '../document-list/documents-service';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FolderService {
  currentFolderChanged = new Subject<string>();

  constructor(private httpClient: HttpClient) { }

  getFolders() {
    this.httpClient.get<Folder[]>(environment.baseUrl + ApiPaths.Folder).subscribe(response => {
      console.log(response);
      return response;
    });
    return [];
  }

  getFolderTree(path: string) {
    return this.httpClient.get<FolderNode>(environment.baseUrl + ApiPaths.FolderTree, {
      params: {
        path: path
      }
    });
  }

  setCurrentFolder(path: string) {
    this.currentFolderChanged.next(path);
  }
}