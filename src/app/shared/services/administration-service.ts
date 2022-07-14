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

  public grantRights(id: string, body: GrantDTO[]) {
    return this.httpClient.post<GrantDTO[]>(
      environment.baseUrl + ApiPaths.AdministrationGrant + '/' + id,
      body
    );
  }

  public getExistingRights(id: string, type: AclClass) {
    const pathExt =
      type == AclClass.FOLDER
        ? ApiPaths.AdministrationFolder
        : ApiPaths.AdministrationDocument;
    return this.httpClient.get<GrantDTO[]>(
      environment.baseUrl + pathExt + '/' + id
    );
  }
}
