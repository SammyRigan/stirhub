/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { IEvent } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-event-block',
  templateUrl: './event-block.component.html',
  styleUrls: ['./event-block.component.scss'],
})
export class EventBlockComponent implements OnInit {

  // @Input() profile: UserProfile;

  iEvents: IEvent[] = [];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getEvents();
  }

  async getEvents() {
    const res = await this.dataService.returnItemsRaw('events', 6, 1, []);
    this.iEvents = res.data;
  }

}
