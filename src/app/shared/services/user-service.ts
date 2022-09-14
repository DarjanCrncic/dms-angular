import { ApiPaths } from 'src/app/api-paths';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface UserDetails {
  first_name: string;
  last_name: string;
  username: string;
  id: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getUserDetails(username: string) {
    return this.httpClient.get<UserDetails>(
      environment.baseUrl + ApiPaths.UserDetails,
      {
        params: {
          username: username
        }
      }
    );
  }

  getAvailableUsers() {
    return this.httpClient.get<UserDetails[]>(
      environment.baseUrl + ApiPaths.User
    );
  }
}
