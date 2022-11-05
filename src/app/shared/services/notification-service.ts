import { ApiPaths } from './../../api-paths';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface DmsNotification {
    id: string;
    recipient: string;
    link_to: string;
    message: string;
    creation_date: Date;
    seen: boolean;
}

@Injectable({providedIn: 'root'})
export class NotificationService {
    constructor(private httpClient: HttpClient) { }

    public getNotifications() {
        return this.httpClient.get<DmsNotification[]>(environment.baseUrl + ApiPaths.Notification);
    }

    public clear() {
        return this.httpClient.delete(environment.baseUrl + ApiPaths.Notification);
    }
}