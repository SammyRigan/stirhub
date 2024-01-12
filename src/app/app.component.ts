import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  route = null;
  constructor(private location: Location) {
    this.route = this.location.path();
    // console.log(this.location.path());
  }
}
