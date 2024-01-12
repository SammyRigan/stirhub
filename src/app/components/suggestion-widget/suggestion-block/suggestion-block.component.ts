/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-suggestion-block',
  templateUrl: './suggestion-block.component.html',
  styleUrls: ['./suggestion-block.component.scss'],
})
export class SuggestionBlockComponent implements OnInit {

  @Input() profile: UserProfile;
  @Input() institution: UserProfile;
  @Input() currentProfile: UserProfile;

  pers: UserProfile;

  constructor(
    private dataService: DataService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    if (this.profile) {
      this.pers = this.profile;
    } else {
      this.pers = this.institution;
    }
    // if (this.profile.instId) {
    //   this.getInstitution();
    // } else {
    //   this.pers = this.profile;
    // }
  }

  close() {
    this.modalCtrl.dismiss();
  }
  // async getInstitution() {
  //   const inst = await this.generalService.getSingleItem(`institutions/${this.profile.instId}`);
  //   this.pers = {
  //     id: inst._id,
  //     ...inst.data() as Institution
  //   };
  // }

  follow() {
    this.pers.followers.push(this.currentProfile._id);
    this.currentProfile.following.push(this.profile._id);
    this.dataService.updateItem('profiles', {...this.pers});
    this.dataService.updateItem('profiles', {...this.currentProfile});
  }

  unfollow() {
    this.pers.followers = this.pers.followers.filter(i => i !== this.currentProfile._id);
    this.currentProfile.following = this.currentProfile.following.filter(i => i !== this.profile._id);
    this.dataService.updateItem('profiles', {...this.pers});
    this.dataService.updateItem('profiles', {...this.currentProfile});
  }

  like() {
    this.currentProfile.liked.push(this.institution._id);
    this.institution.likedBy.push(this.currentProfile._id);
    this.dataService.updateItem('profiles', {...this.institution});
    this.dataService.updateItem('profiles', {...this.currentProfile});
  }

  unlike() {
    this.currentProfile.liked = this.currentProfile.liked.filter(i => i !== this.institution._id);
    this.institution.likedBy = this.institution.likedBy.filter(i => i !== this.currentProfile._id);
    this.dataService.updateItem('profiles', {...this.institution});
    this.dataService.updateItem('profiles', {...this.currentProfile});
  }

  observe() {
    this.currentProfile.observing.push(this.profile._id);
    this.profile.observedBy.push(this.currentProfile._id);
    this.dataService.updateItem('profiles', {...this.profile});
    this.dataService.updateItem('profiles', {...this.currentProfile});
  }

  unobserve() {
    this.currentProfile.observing = this.currentProfile.observing.filter(i => i !== this.profile._id);
    this.profile.observedBy = this.profile.observedBy.filter(i => i !== this.currentProfile._id);
    this.dataService.updateItem('profiles', {...this.profile});
    this.dataService.updateItem('profiles', {...this.currentProfile});
  }

  ifollow() {
    this.currentProfile.following.push(this.institution._id);
    this.institution.followers.push(this.currentProfile._id);
    this.dataService.updateItem('profiles', {...this.institution});
    this.dataService.updateItem('profiles', {...this.currentProfile});
  }

  iunfollow() {
    this.currentProfile.following = this.currentProfile.following.filter(i => i !== this.institution._id);
    this.institution.followers = this.institution.followers.filter(i => i !== this.currentProfile._id);
    this.dataService.updateItem('profiles', {...this.institution});
    this.dataService.updateItem('profiles', {...this.currentProfile});
  }

}
