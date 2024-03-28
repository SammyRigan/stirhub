import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PosterComponent } from 'src/app/components/shared/poster/poster.component';
import { UserProfile } from 'src/app/models/models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  people: UserProfile[] = [];
  lastDoc = null;
  empty = false;
  isLoading = true;

  profile: any;

  constructor(
    private generalService: GeneralService,
    private modalCtrl: ModalController
    // private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    // console.log(this.collection);
    this.getUserProfile();
    this.getItems();
  }

  // GET CURRENTLY LOGGED IN USER
  async getUserProfile() {
    this.profile = await this.generalService.getMyProfile();
    // console.log(this.profile);
    this.generalService.getProfileUpdateListener().subscribe((profile) => {
      this.profile = profile;
      console.log(this.profile);
    });
    // if (this.profile.adminId) {
    //   this.proType = 'institution';
    // } else {
    //   this.proType = 'person';
    // }
    this.isLoading = false;
  }


  async getItems() {
    const ref = await this.generalService.getPeople('user-profiles', this.lastDoc, ['practitioner', 'student'], null);
    const items = ref.docs.map(e => ({
      id: e.id,
      ...e.data() as UserProfile
    }));
    this.people = this.people.concat(items);
    this.empty = ref.empty;
    if (!this.empty && items.length <= 20) {
      this.empty = true;
    }
    if (ref.size > 0) {
      this.lastDoc = ref.docs[ref.docs.length - 1];
    }
  }

  async makePost() {
    const modal = await this.modalCtrl.create({
      component: PosterComponent,
      cssClass: ['auto-height', 'post-wrap'],
      componentProps: {
        poster: {
          id: this.profile.id,
          type: this.profile.adminId ? 'institution' : 'user-profile',
          imgUrl: this.profile.imgUrl
        }
      }
    });
    await modal.present();
  }

}
