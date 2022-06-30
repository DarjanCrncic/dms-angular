import { TestService } from './../shared/services/test-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private testService: TestService) { }

  ngOnInit(): void {
  }

  onClick() {
    this.testService.getError().subscribe();
  }

}
