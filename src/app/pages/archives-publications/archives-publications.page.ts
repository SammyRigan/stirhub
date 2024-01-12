import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PosterComponent } from 'src/app/components/shared/poster/poster.component';
import { Publication } from 'src/app/models/models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-archives-publications',
  templateUrl: './archives-publications.page.html',
  styleUrls: ['./archives-publications.page.scss'],
})
export class ArchivesPublicationsPage implements OnInit {

  publications: Publication[] = [];
  lastDoc = null;
  empty = false;

  profile: any;
  isLoading = true;

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
    this.isLoading = false;
    // if (this.profile.adminId) {
    //   this.proType = 'institution';
    // } else {
    //   this.proType = 'person';
    // }
    // this.isLoading = false;
  }

  async getItems() {
    const ref = await this.generalService.getItems('publications', this.lastDoc, 30);
    const items = ref.docs.map(e => ({
      id: e.id,
      ...e.data() as Publication
    }));
    this.publications = this.publications.concat(items);
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
