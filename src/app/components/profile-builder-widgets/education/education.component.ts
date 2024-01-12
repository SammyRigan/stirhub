/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { EdInfo, UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationComponent implements OnInit {
  @Input() profile: UserProfile;
  @Input() educationInfo: EdInfo;

  edIndex: number;

  constructor(
    private generalService: GeneralService,
    private dataService: DataService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {
    if (!this.educationInfo) {
      this.educationInfo = {
        school: null,
        startDate: null,
        endDate: null,
        offered: null,
        degree: null,
        contact: {
          email: null,
          telephone: null
        },
        current: false
      };
    } else {
      this.edIndex = this.profile.educationHistory.findIndex(e => e === this.educationInfo);
      console.log(this.edIndex);
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async updateProfile(del: boolean) {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    if (del) {
      this.profile.educationHistory = this.profile.educationHistory.filter(e => e !== this.educationInfo);
    } else {
      if (this.edIndex >= 0) {
        this.profile.educationHistory[this.edIndex] = this.educationInfo;
      } else {
        this.profile.educationHistory.push(this.educationInfo);
      }
    }
    this.dataService.updateItem('profiles', {...this.profile});
    await this.modalCtrl.dismiss(this.profile);
    await loading.dismiss();
  }

  async deleteEducation() {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure you want to remove your "' + this.educationInfo.school + '" education?',
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
