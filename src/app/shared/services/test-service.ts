import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TestService {
    constructor(private httpClient: HttpClient) {}

    getError() {
        return this.httpClient.get(environment.baseUrl + '/ping/error');
    }
}
