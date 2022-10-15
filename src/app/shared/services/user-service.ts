import { Sort } from '@angular/material/sort';
import { ApiPaths } from 'src/app/api-paths';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface UserDetails {
    first_name: string;
    last_name: string;
    username: string;
    id: string;
    creation_date: Date;
    modify_date: Date;
    email: string;
    role: string;
    privileges: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private httpClient: HttpClient) {}
    refresh: Subject<null> = new Subject();

    getUserDetails(username: string) {
        return this.httpClient.get<UserDetails>(environment.baseUrl + ApiPaths.UserDetails, {
            params: {
                username: username
            }
        });
    }

    getAvailableUsers(sort?: Sort, search?: string) {
        return this.httpClient.get<UserDetails[]>(environment.baseUrl + ApiPaths.User, {
            params: {
                search: search ?? '',
                sort: sort?.active ?? '',
                direction: sort?.direction ?? ''
            }
        });
    }

    createUser(userDetails: UserDetails) {
        return this.httpClient.post<UserDetails>(environment.baseUrl + ApiPaths.User, userDetails);
    }

    updateUser(userDetails: UserDetails, id: string) {
        return this.httpClient.patch<UserDetails>(environment.baseUrl + ApiPaths.User + '/' + id, userDetails);
    }
}
