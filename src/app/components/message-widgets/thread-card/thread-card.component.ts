/* eslint-disable no-underscore-dangle */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Thread } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-thread-card',
  templateUrl: './thread-card.component.html',
  styleUrls: ['./thread-card.component.scss'],
})
export class ThreadCardComponent implements OnInit {

  @Input() thread: Thread;
  @Input() profile: any;
  @Output() hider: EventEmitter<any> = new EventEmitter();

  receiver: any;

  constructor(
    private generalService: GeneralService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getReceiver();
  }

  async getReceiver() {
    const profileId = this.thread.participantIds.filter(i => i !== this.profile._id)[0];
    const ref = await this.dataService.getSingleItem('profiles', profileId);
    this.receiver = ref.data;
  }

  viewThread() {
    this.hider.emit(this.receiver);
  }

}
