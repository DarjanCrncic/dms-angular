import { ApiPaths } from './../../api-paths';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface GrantDTO {
  username: string;
  permissions: string[];
}

export enum AclClass {
  DOCUMENT,
  FOLDER,
}

@Injectable({ providedIn: 'root' })
export class AdministrationService {
  constructor(private httpClient: HttpClient) {}

  public grantRights(id: string, body: GrantDTO[], type: AclClass) {
    return this.httpClient.post<GrantDTO[]>(
      environment.baseUrl + this.getPathGrant(type) + '/' + id,
      body
    );
  }

  public getExistingRights(id: string, type: AclClass) {
    return this.httpClient.get<GrantDTO[]>(
      environment.baseUrl + this.getPath(type) + '/' + id
    );
  }

  public getPathGrant(entity: AclClass): string {
    switch (entity) {
      case AclClass.DOCUMENT:
        return ApiPaths.AdministrationDocumentGrant;
      case AclClass.FOLDER:
        return ApiPaths.AdministrationFolderGrant;
    }
  }

  public getPath(entity: AclClass): string {
    switch (entity) {
      case AclClass.DOCUMENT:
        return ApiPaths.AdministrationDocument;
      case AclClass.FOLDER:
        return ApiPaths.AdministrationFolder;
    }
  }
}
