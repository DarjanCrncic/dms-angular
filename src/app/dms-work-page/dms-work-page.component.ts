import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { SidebarService } from '../shared/services/sidebar-service';
@Component({
  selector: 'app-dms-work-page',
  templateUrl: './dms-work-page.component.html',
  styleUrls: ['./dms-work-page.component.css']
})
export class DmsWorkPageComponent implements OnInit, OnDestroy {
  opened = true;
  sidebarSubscription = new Subscription();
  navWidth = 400;
  resizing = false;
  private $componentDestroyed = new Subject();

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarService.$toggleSidebar
      .pipe(takeUntil(this.$componentDestroyed))
      .subscribe((isOpened) => {
        this.opened = isOpened;
      });
    this.sidebarService.$sidebarWidth
      .pipe(takeUntil(this.$componentDestroyed))
      .subscribe((width) => {
        this.navWidth = width;
      });
  }
  ngOnDestroy(): void {
    this.$componentDestroyed.next(true);
  }

  onToggleEvent() {
    this.sidebarService.toggle();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.resizing) {
      this.sidebarService.setSidebarWidth(event.clientX);
    }
  }

  setResizing() {
    this.resizing = true;
  }

  resetResizing() {
    this.resizing = false;
  }
}
