import { Subscription } from 'rxjs';
import { SidebarService } from '../shared/services/sidebar-service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dms-work-page',
  templateUrl: './dms-work-page.component.html',
  styleUrls: ['./dms-work-page.component.css']
})
export class DmsWorkPageComponent implements OnInit, OnDestroy {
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
    this.sidebarSubscription && this.sidebarSubscription.unsubscribe();
  }

  onToggleEvent() {
    this.opened = !this.opened;
  }
}
