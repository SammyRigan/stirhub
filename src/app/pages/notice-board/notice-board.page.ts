/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateAnnouncementComponent } from 'src/app/components/shared/create-announcement/create-announcement.component';
import { TimePost, UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-notice-board',
  templateUrl: './notice-board.page.html',
  styleUrls: ['./notice-board.page.scss'],
})
export class NoticeBoardPage implements OnInit {

  profile: UserProfile;
  announcements: TimePost[] = [];
  isLoading = true;

  constructor(
    private dataService: DataService,
    private generalService: GeneralService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getUserProfile();
    this.getAnnouncements();
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

  async getAnnouncements() {
    const res = await this.generalService
    .getItemWithFilter('timeline', null, [{key: 'announcement', value: true}], 50);
    this.announcements = res.docs.map(e => ({
      id: e.id,
      ...e.data() as TimePost
    }));
  }

  async makeAnnouncement() {
    const modal = await this.modalCtrl.create({
      component: CreateAnnouncementComponent,
      componentProps: {
        profileId: this.profile._id
      }
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data) {
      this.announcements.unshift(data);
    }
  }

}
