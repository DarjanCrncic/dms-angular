import { Subscription } from 'rxjs';
import { SidebarService } from '../shared/services/sidebar-service';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { DragRef, Point } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dms-work-page',
  templateUrl: './dms-work-page.component.html',
  styleUrls: ['./dms-work-page.component.css']
})
export class DmsWorkPageComponent implements OnInit, OnDestroy {
  opened = true;
  sidebarSubscription = new Subscription();
  sideNavWidth: number = 400;

  @ViewChild('drawer') sidenav: ElementRef<HTMLElement> | null = null;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarSubscription = this.sidebarService.$toggleSidebar.subscribe(
      (isOpened) => {
        this.opened = isOpened;
      }
    );
  }
  ngOnDestroy(): void {
    this.sidebarSubscription && this.sidebarSubscription.unsubscribe();
  }

  onToggleEvent() {
    this.sidebarService.toggle();
  }
}
