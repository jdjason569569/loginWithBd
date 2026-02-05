import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InactivityService } from './core/services/inactivity.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class App implements OnInit {
  title = 'login-app';

  constructor(private inactivityService: InactivityService) { }

  ngOnInit(): void {
    this.inactivityService.startMonitoring();
  }
}
