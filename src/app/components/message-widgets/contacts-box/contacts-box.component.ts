/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-contacts-box',
  templateUrl: './contacts-box.component.html',
  styleUrls: ['./contacts-box.component.scss'],
})
export class ContactsBoxComponent implements OnInit {

  @Input() profile: UserProfile;

  people: UserProfile[] = [];
  empty: boolean;
  lastDoc = null;
  page = 1;

  constructor(
    private generalService: GeneralService,
    private dataService: DataService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getItems();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async getItems() {
    const res = await this.dataService.returnItemsRaw('profiles', 20, this.page, []);
    this.people = this.people.concat(res.data);
    this.people = this.people.filter(i => i._id !== this.profile._id);
    this.page += 1;
  }

  selectContact(contact: any) {
    this.modalCtrl.dismiss(contact);
  }

}
