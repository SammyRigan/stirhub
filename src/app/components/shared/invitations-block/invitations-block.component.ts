import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/models';
import { InvitationComponent } from '../invitation/invitation.component';
import { InvitationsSentComponent } from './invitations-sent/invitations-sent.component';

@Component({
  selector: 'app-invitations-block',
  templateUrl: './invitations-block.component.html',
  styleUrls: ['./invitations-block.component.scss'],
})
export class InvitationsBlockComponent implements OnInit {

  @Input() profile: UserProfile;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  async invite() {
    const modal = await this.modalCtrl.create({
      component: InvitationComponent,
      componentProps: {
        profile: this.profile
      }
    });
    await modal.present();
  }

  async viewSent(signed: boolean) {
    const modal = await this.modalCtrl.create({
      component: InvitationsSentComponent,
      componentProps: {
        profile: this.profile,
        signed
      }
    });
    await modal.present();
  }

}
