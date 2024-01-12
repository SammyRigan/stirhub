/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { IEvent, UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {

  @Input() profile: UserProfile;

  iEvent: IEvent = {
    _id: null,
    date: null,
    profileId: null,
    title: null,
    description: null,
    imageUrl: null,
    startDate: null,
    endDate: null,
    attendees: [],
    physicalDetails: {
      name: null,
      mapLink: null
    },
    virtualDetails: {
      platform: null,
      link: null
    },
    type: 'both'
  };

  constructor(
    private dataService: DataService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  async createEvent() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.iEvent.profileId = this.profile._id;
    this.iEvent.date = Date.now().toString();
    const res = await this.dataService.addItem(this.iEvent, 'events');
    this.iEvent._id = res.dataId;
    this.modalCtrl.dismiss(this.iEvent);
    loading.dismiss();
  }


}
