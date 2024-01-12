/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ResearchComponent } from 'src/app/components/shared/research/research.component';
import { Research, UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-single-research',
  templateUrl: './single-research.page.html',
  styleUrls: ['./single-research.page.scss'],
})
export class SingleResearchPage implements OnInit {

  profile: UserProfile;
  research: Research;
  lead: UserProfile;
  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private generalService: GeneralService,
    private dataService: DataService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getUserProfile();
    const resId = this.activatedRoute.snapshot.params.pid;
    this.getResearch(resId);
    // let collection: string;
    // if (type === 'person') {
    //   collection = 'user-profiles';
    // } else {
    //   collection = 'institution';
    // }
    // this.getProfile(collection, proId);
  }

  async getUserProfile() {
    this.profile = await this.dataService.getLoggedInProfile();
    if (this.profile) {
      this.isLoading = false;
    }
    this.dataService.getUserUpdateListener().subscribe((profile) => {
      this.profile = profile;
      this.isLoading = false;
    });
  }

  async getResearch(resId: string) {
    const ref = await this.dataService.getSingleItem('researches', resId);
    this.research = ref.data;
    if (this.research.lead.userId) {
      await this.getLead(this.research.lead.userId);
    }
  }

  async getLead(id: string) {
    const ref = await this.dataService.getSingleItem('profiles', id);
    this.lead = ref.data();
  }

  async makeResearch() {
    const modal = await this.modalCtrl.create({
      component: ResearchComponent,
      cssClass: 'bg-wrap',
      componentProps: {
        poster: {
          id: this.profile._id,
          type: this.profile.iType,
          imgUrl: this.profile.profileImgUrl ? this.profile.profileImgUrl : null
        }
      }
    });
    await modal.present();
  }

}
