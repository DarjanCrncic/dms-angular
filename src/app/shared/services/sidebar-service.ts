import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SidebarService {
  toggleSidebar = new Subject<string>();

  constructor() { }
  
}