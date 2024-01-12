import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CreateEventComponent } from 'src/app/components/event-widgets/create-event/create-event.component';
import { IEvent, UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-events-hub',
  templateUrl: './events-hub.page.html',
  styleUrls: ['./events-hub.page.scss'],
})
export class EventsHubPage implements OnInit, OnDestroy {

  profile: UserProfile;
  iEvents: IEvent[] = [];
  page = 1;
  count = 0;

  isLoading = true;

  subs: Subscription[] = [];

  constructor(
    private dataService: DataService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getUserProfile();
    this.getEvents();
    // console.log(this.researches);
    const $sub = this.dataService.getColUpdateListener('events')
    .subscribe(({iEvents, count}) => {
      this.iEvents = iEvents;
      this.count = count;
      // console.log(this.researches);
    });
    this.subs.push($sub);
  }

  async getUserProfile() {
    this.profile = await this.dataService.getLoggedInProfile();
    if (this.profile) {
      this.isLoading = false;
    }
    this.dataService.getUserUpdateListener().subscribe((profile) => {
      this.profile = profile;
      this.isLoading = false;
      // if (this.profile && this.profile._id === profile._id) {
      //   this.profile = profile;
      // } else {
      //   this.profile = profile;
      //   this.getAssets();
      // }
    });
  }

  async getEvents() {
    this.dataService.getItems('events', 30, this.page, []);
  }

  async addEvent() {
    const modal = await this.modalCtrl.create({
      component: CreateEventComponent,
      componentProps: {
        profile: {...this.profile}
      }
    });
    await modal.present();
  }

  ngOnDestroy(): void {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }

}
