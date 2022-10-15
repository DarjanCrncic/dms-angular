import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
    private toggleSidebar = new BehaviorSubject<boolean>(true);
    private sidebarWidth = new BehaviorSubject<number>(400);

    $toggleSidebar = this.toggleSidebar.asObservable();
    $sidebarWidth = this.sidebarWidth.asObservable();
    constructor() {}

    toggle() {
        this.toggleSidebar.next(!this.toggleSidebar.getValue());
    }

    setSidebarWidth(width: number) {
        this.sidebarWidth.next(width);
    }
}
