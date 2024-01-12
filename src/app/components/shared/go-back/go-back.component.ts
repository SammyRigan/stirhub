import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-go-back',
  templateUrl: './go-back.component.html',
  styleUrls: ['./go-back.component.scss'],
})
export class GoBackComponent implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit(
  ) {}

  goBack() {
    this.location.back();
  }

}
