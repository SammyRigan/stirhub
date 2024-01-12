/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PosterComponent } from 'src/app/components/shared/poster/poster.component';
import { ResearchComponent } from 'src/app/components/shared/research/research.component';
// import { ActivatedRoute } from '@angular/router';
import { Research, UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.page.html',
  styleUrls: ['./archives.page.scss'],
})
export class ArchivesPage implements OnInit {

  researches: Research[] = [];
  lastDoc = null;
  empty = false;

  page = 1;
  count = 0;

  profile: UserProfile;
  isLoading = true;

  constructor(
    private generalService: GeneralService,
    private dataService: DataService,
    private modalCtrl: ModalController
    // private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    // console.log(this.collection);
    this.getUserProfile();
    this.getItems();
    // console.log(this.researches);
    this.dataService.getColUpdateListener('researches')
    .subscribe(({researches, count}) => {
      this.researches = researches;
      this.count = count;
      // console.log(this.researches);
    });
  }

  // GET CURRENTLY LOGGED IN USER
  // async getUserProfile() {
  //   this.profile = await this.generalService.getMyProfile();
  //   this.generalService.getProfileUpdateListener().subscribe((profile) => {
  //     this.profile = profile;
  //   });
  //   this.isLoading = false;
  // }

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

  async getItems() {
    this.dataService.getItems('researches', 30, 0, []);
    // this.researches = this.researches.concat(items);
    // this.empty = ref.empty;
    // if (!this.empty && items.length <= 20) {
    //   this.empty = true;
    // }
    // if (ref.size > 0) {
    //   this.lastDoc = ref.docs[ref.docs.length - 1];
    // }
  }

  async makePost() {
    const modal = await this.modalCtrl.create({
      component: PosterComponent,
      cssClass: ['auto-height', 'post-wrap'],
      componentProps: {
        poster: {
          id: this.profile._id,
          type: this.profile.name ? 'institution' : 'user-profile',
          imgUrl: this.profile.profileImgUrl
        }
      }
    });
    await modal.present();
  }

  async createResearch() {
    const modal = await this.modalCtrl.create({
      component: ResearchComponent,
      // cssClass: ,
      componentProps: {
        poster: {
          id: this.profile._id,
          type: this.profile.name ? 'institution' : 'user-profile',
          imgUrl: this.profile.profileImgUrl
        },
        profile: this.profile
      }
    });
    await modal.present();
  }

}
