/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Thread, UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';
import { ContactsBoxComponent } from '../contacts-box/contacts-box.component';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
})
export class MessageBoxComponent implements OnInit, OnDestroy {

  allThreads: Thread[] = [];
  lastDoc = null;
  empty: boolean;
  pop = false;
  thread: Thread = null;
  currentReceiver = null;
  profile: UserProfile;
  subs: Subscription[] = [];

  constructor(
    private modalCtrl: ModalController,
    private generalService: GeneralService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getUserProfile();
  }

  // GET CURRENTLY LOGGED IN USER
  async getUserProfile() {
    this.profile = await this.dataService.getLoggedInProfile();
    if (this.profile) {
      this.getThreads();
      // this.isLoading = false;
    }
    this.dataService.getUserUpdateListener().subscribe((profile) => {
      this.profile = profile;
      // this.isLoading = false;
      if (this.profile && this.profile._id === profile._id) {
        this.profile = profile;
      } else {
        this.profile = profile;
        this.getThreads();
      }
    });
  }

  async getThreads() {
    const ref = this.generalService.getMyThreads(this.profile?._id).subscribe(res => {
      this.allThreads = res.map(e => ({
        id: e.payload.doc.id,
        ...e.payload.doc.data() as Thread
      }));
    });
    this.subs.push(ref);
  }

  async contacts() {
    const modal = await this.modalCtrl.create({
      component: ContactsBoxComponent,
      componentProps: {
        profile: this.profile
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.thread = {
        id: null,
        date: null,
        participantIds: [this.profile._id, data._id],
        lastMessage: null,
        archived: [],
        messageCount: 0,
        unreadCount: 0,
        lastMsgDate: null
      };
      this.currentReceiver = data;
      this.pop = true;
    }
  }

  selectThread(receiver: any, thread: Thread) {
    this.thread = thread;
    this.currentReceiver = receiver;
    this.pop = true;
  }

  ngOnDestroy() {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }

}
