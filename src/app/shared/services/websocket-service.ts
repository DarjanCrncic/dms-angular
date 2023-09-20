import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as Stomp from 'stompjs';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
    private stompClient: Stomp.Client | null = null;
    documents$: BehaviorSubject<any> = new BehaviorSubject(null);
    folders$: BehaviorSubject<any> = new BehaviorSubject(null);

    public connect(token: string): void {
        this.stompClient = Stomp.client(environment.wsSpring);

        this.stompClient.connect({ Authorization: `Bearer ${token}` }, (frame) => {
            console.log('Connected: ' + frame);

            this.stompClient?.subscribe('/folders', (message: any) => {
                this.folders$.next(message);
            });

            this.stompClient?.subscribe('/documents', (message: any) => {
                this.documents$.next(message);
            });
        });
    }

    public registerNotification(id: string) {
        this.stompClient?.send('/dms/notifications/register', {}, id);
    }

    public disconnect() {
        this.stompClient?.disconnect(() => {
            this.stompClient = null;
        });
    }
}
