import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ResearchComponent } from 'src/app/components/shared/research/research.component';
import { Publication, UserProfile } from 'src/app/models/models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-single-publications',
  templateUrl: './single-publications.page.html',
  styleUrls: ['./single-publications.page.scss'],
})
export class SinglePublicationsPage implements OnInit {

  profile: any;
  publication: Publication;
  author: any;
  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private generalService: GeneralService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getProfile();
    const resId = this.activatedRoute.snapshot.params.pid;
    this.getPublication(resId);
    // let collection: string;
    // if (type === 'person') {
    //   collection = 'user-profiles';
    // } else {
    //   collection = 'institution';
    // }
    // this.getProfile(collection, proId);
  }

  async getProfile() {
    this.profile = await this.generalService.getMyProfile();
    // console.log(this.profile);
    this.generalService.getProfileUpdateListener().subscribe((profile) => {
      this.profile = profile;
      console.log(this.profile);
    });
    this.isLoading = false;
  }

  async getPublication(resId: string) {
    const ref = await this.generalService.getSingleItem(`publications/${resId}`);
    this.publication = {
      id: ref.id,
      ...ref.data() as Publication
    };
    if (this.publication.author.userId) {
      await this.getAuthor(this.publication.author.userId);
    }
    this.isLoading = false;
  }

  async getAuthor(id: string) {
    const ref = await this.generalService.getSingleItem(`user-profiles/${id}`);
    this.author = {
      id: ref.id,
      ...ref.data() as UserProfile
    };
  }


  async research() {
    const modal = await this.modalCtrl.create({
      component: ResearchComponent,
      cssClass: 'bg-wrap',
      componentProps: {
        poster: {
          id: this.profile.id,
          type: this.profile.adminId ? 'institution' : 'user-profile',
          imgUrl: this.profile.imgUrl ? this.profile.imgUrl : null
        }
      }
    });
    await modal.present();
  }
}
