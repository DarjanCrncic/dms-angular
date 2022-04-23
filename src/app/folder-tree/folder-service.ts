import { FolderNode } from './folder-node.model';
import { Folder } from './folder.model';
import { ApiPaths } from './../api-paths';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class FolderService {
  constructor(private httpClient: HttpClient) { }

  getFolders(): Folder[] {
    this.httpClient.get(environment.baseUrl + ApiPaths.Folder).subscribe(response => {
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
}