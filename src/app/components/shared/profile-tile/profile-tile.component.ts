import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/models';
import { FollowingComponent } from '../following/following.component';

@Component({
  selector: 'app-profile-tile',
  templateUrl: './profile-tile.component.html',
  styleUrls: ['./profile-tile.component.scss'],
})
export class ProfileTileComponent implements OnInit {

  @Input() profile: UserProfile;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  async viewClout(ids: string[], collection: string, title: string) {
    const modal = await this.modalCtrl.create({
      component: FollowingComponent,
      componentProps: {
        profileIds: ids,
        profile: this.profile,
        collection,
        title
      }
    });
    await modal.present();
  }

}
