import { ApiPaths } from './../../api-paths';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface GroupDTO {
    id: string;
    group_name: string;
    description: string;
}

@Injectable({ providedIn: 'root' })
export class GroupService {
    constructor(private httpClient: HttpClient) {}
    refresh: Subject<null> = new Subject();

    getGroups(sort?: Sort, search?: string) {
        return this.httpClient.get<GroupDTO[]>(environment.baseUrl + ApiPaths.Group, {
            params: {
                search: search ?? '',
                sort: sort?.active ?? '',
                direction: sort?.direction ?? ''
            }
        });
    }

    createGroup(group: GroupDTO) {
        return this.httpClient.post<GroupDTO>(environment.baseUrl + ApiPaths.Group, group);
    }

    updateGroup(group: GroupDTO, id: string) {
        return this.httpClient.put<GroupDTO>(environment.baseUrl + ApiPaths.Group + '/' + id, group);
    }
}
