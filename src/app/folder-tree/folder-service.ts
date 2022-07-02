import { FolderNode } from './folder-node.model';
import { Folder } from './folder.model';
import { ApiPaths } from './../api-paths';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FolderService {
  currentFolderChanged = new Subject<string>();
  private currentPath = '';

  constructor(private httpClient: HttpClient) {}

  getFolders() {
    this.httpClient
      .get<Folder[]>(environment.baseUrl + ApiPaths.Folder)
      .subscribe((response) => {
        return response;
      });
    return [];
  }

  getFolderTree(path: string) {
    return this.httpClient.get<FolderNode>(
      environment.baseUrl + ApiPaths.FolderTree,
      {
        params: {
          path: path,
        },
      }
    );
  }

  setCurrentFolder(path: string) {
    this.currentPath = path;
    this.currentFolderChanged.next(path);
  }

  getCurrentPath() {
    return this.currentPath;
  }

  getParentPath() {
    if (this.currentPath === '/') return this.currentPath;
    const newPaths = this.currentPath.split('/');
    newPaths.pop();
    return newPaths.length > 1 ? newPaths.join('/') : '/';
  }

  createNewFolder(name: string) {
    return this.httpClient.post(environment.baseUrl + ApiPaths.Folder, {
      path: this.currentPath + (this.currentPath === '/' ? '' : '/') + name,
    });
  }

  deleteById(id: string) {
    return this.httpClient.delete(
      environment.baseUrl + ApiPaths.Folder + '/' + id
    );
  }
}
