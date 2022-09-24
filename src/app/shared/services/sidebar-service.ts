import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private toggleSidebar = new BehaviorSubject<boolean>(true);

  $toggleSidebar = this.toggleSidebar.asObservable();
  constructor() {}

  toggle() {
    this.toggleSidebar.next(!this.toggleSidebar.getValue());
  }
}
