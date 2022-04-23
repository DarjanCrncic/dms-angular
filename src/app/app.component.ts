import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  opened = true;

  title = 'dms-angular-frontend';

  onToggleEvent() {
    this.opened = !this.opened;
  }
}
