import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.css']
})
export class ContentHeaderComponent {
  @Input() title: string = '';
  @Input() enableSearch: boolean = false;
  @Output() search: EventEmitter<string> = new EventEmitter();

  constructor() {}

  emitSearch($event: string) {
    this.search.emit($event);
  }
}
