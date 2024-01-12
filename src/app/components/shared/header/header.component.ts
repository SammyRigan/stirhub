import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { InvitationComponent } from '../invitation/invitation.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() profile: UserProfile;
  @Input() active: string;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  logout() {
    this.authService.logout();
  }

  async invite() {
    const modal = await this.modalCtrl.create({
      component: InvitationComponent,
      componentProps: {
        profile: this.profile
      }
    });
    await modal.present();
  }

}
