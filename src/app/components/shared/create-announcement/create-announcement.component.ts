import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { TimePost } from 'src/app/models/models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.scss'],
})
export class CreateAnnouncementComponent implements OnInit {

  @Input() profileId: string;

  announcement: TimePost = {
    id: null,
    date: null,
    likes: 0,
    shares: 0,
    comments: 0,
    imgUrls: [],
    repliedTo: null,
    text: null,
    profileId: null,
    announcement: true,
    institution: true
  };

  colors = [
    '#e34534',
    '#3f82d9',
    '#ceb423',
    '#1c2537',
    '#1fb199',
    '#b1328b'
  ];

  constructor(
    private generalService: GeneralService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {}

    close() {
      this.modalCtrl.dismiss();
    }

  async addAnnouncement() {
    if (!this.announcement.color || !this.announcement.text) {
      return;
    }
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.announcement.date = Date.now().toString();
    this.announcement.profileId = this.profileId;
    const res = await this.generalService.addItem('timeline', this.announcement);
    this.announcement.id = res.id;
    this.modalCtrl.dismiss(this.announcement);
    loading.dismiss();
  }

}
