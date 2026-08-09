import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Portal Search Desk';

  constructor(private readonly router: Router) {}

  surpriseMe(): void {
    const episodeId = Math.floor(Math.random() * 51) + 1;
    this.router.navigate(['/episodes', episodeId]);
  }
}
