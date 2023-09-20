import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { ApiPaths } from './../api-paths';
import { FolderNode } from './folder-node.model';
import { Folder } from './folder.model';

@Injectable({ providedIn: 'root' })
export class FolderService {
    constructor(private httpClient: HttpClient) {}

    getFolders() {
        this.httpClient.get<Folder[]>(environment.baseUrl + ApiPaths.Folder).subscribe((response) => {
            return response;
        });
        return [];
    }

    getFolderTree() {
        return this.httpClient.get<FolderNode[]>(environment.baseUrl + ApiPaths.FolderTree);
    }

    createNewFolder(name: string, parentFolderId: string, isRoot: boolean) {
        return this.httpClient.post<FolderNode>(environment.baseUrl + ApiPaths.Folder, {
            name: name,
            parent_folder_id: parentFolderId,
            rootFolder: isRoot
        });
    }

    deleteById(id: string) {
        return this.httpClient.delete(environment.baseUrl + ApiPaths.Folder + '/' + id);
    }

    updateFolderPath(id: string, newPath: string) {
        return this.httpClient.put<FolderNode>(environment.baseUrl + ApiPaths.Folder + '/' + id, {
            name: newPath
        });
    }
}
