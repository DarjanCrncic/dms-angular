import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.css']
})
export class ContentHeaderComponent implements OnInit {
  @Output() toggleSidebarEmitter = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onToggleClick() {
    this.toggleSidebarEmitter.emit();
  }
}
