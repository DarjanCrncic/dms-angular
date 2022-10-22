import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as Stomp from 'stompjs';

export interface NotificationMessage {
    receivers: string[];
    link_to: string;
    message: string;
    timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class WebsocketService {
    private stompClient: Stomp.Client | null = null;
    documents$: BehaviorSubject<any> = new BehaviorSubject(null);
    fodlers$: BehaviorSubject<any> = new BehaviorSubject(null);

    public connect(token: string): void {
        this.stompClient = Stomp.client(environment.ws);

        this.stompClient.connect({ Authorization: `Bearer ${token}` }, (frame) => {
            console.log('Connected: ' + frame);

            this.stompClient?.subscribe('/folders', (message: any) => {
                this.fodlers$.next(message);
            });

            this.stompClient?.subscribe('/documents', (message: any) => {
                this.documents$.next(message);
            });
        });
    }

    public sendMessage(message: string) {
        this.stompClient?.send('/dms/hello', {}, message);
    }

    public disconnect() {
        this.stompClient?.disconnect(() => {
            this.stompClient = null;
        });
    }
}
