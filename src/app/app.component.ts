import { Subscription } from 'rxjs';
import { SidebarService } from './sidebar-service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  opened = true;
  sidebarSubscription = new Subscription();

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarSubscription = this.sidebarService.toggleSidebar.subscribe(
      (event) => {
        this.onToggleEvent();
      }
    );
  }
  ngOnDestroy(): void {
    this.sidebarSubscription.unsubscribe();
  }

  onToggleEvent() {
    this.opened = !this.opened;
  }
}
