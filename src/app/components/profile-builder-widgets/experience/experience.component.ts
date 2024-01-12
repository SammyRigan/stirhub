/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { UserProfile, WorkInfo } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements OnInit {

  @Input() workInfo: WorkInfo;
  @Input() profile: UserProfile;

  exIndex: number;

  constructor(
    private generalService: GeneralService,
    private dataService: DataService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    if (!this.workInfo) {
      this.workInfo = {
        title: null,
        company: null,
        location: null,
        startDate: null,
        endDate: null,
        current: false
      };
    } else {
      this.exIndex = this.profile.workHistory.findIndex(c => c === this.workInfo);
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async updateProfile(del: boolean) {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    if (del) {
      this.profile.workHistory = this.profile.workHistory.filter(e => e !== this.workInfo);
    } else {
      if (this.exIndex >= 0) {
        this.profile.workHistory[this.exIndex] = this.workInfo;
      } else {
        this.profile.workHistory.push(this.workInfo);
      }
    }
    this.dataService.updateItem('profiles', {...this.profile});
    await this.modalCtrl.dismiss(this.profile);
    await loading.dismiss();
  }

  async deleteExperience() {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure you want to delete your ' + this.workInfo.title + ' experience?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => this.updateProfile(true)
        }
      ]
    });
    await alert.present();
  }

}
