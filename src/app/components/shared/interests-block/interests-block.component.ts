import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/models';
import { InterestsSelectComponent } from '../interests-select/interests-select.component';

@Component({
  selector: 'app-interests-block',
  templateUrl: './interests-block.component.html',
  styleUrls: ['./interests-block.component.scss'],
})
export class InterestsBlockComponent implements OnInit {

  @Input() profile: UserProfile;
  @Input() add: boolean;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  async editInterests() {
    const modal = await this.modalCtrl.create({
      component: InterestsSelectComponent,
      componentProps: {
        profile: {...this.profile}
      }
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data) {
      this.profile = data;
    }
  }

}
