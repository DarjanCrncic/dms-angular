import { SidebarService } from './../../sidebar-service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.css'],
})
export class ContentHeaderComponent implements OnInit {
  @Input() title: string = "";
  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {}

  onToggleClick() {
    this.sidebarService.toggleSidebar.next('toggle');
  }
}
