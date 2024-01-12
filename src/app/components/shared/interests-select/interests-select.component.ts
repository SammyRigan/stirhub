import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-interests-select',
  templateUrl: './interests-select.component.html',
  styleUrls: ['./interests-select.component.scss'],
})
export class InterestsSelectComponent implements OnInit {

  @Input() profile: UserProfile;

  interests = [
    'Biomedical Engineering',
    'AI',
    'Nature',
    'IoT',
    'Innovative Sciences',
    'Acheology',
    'Culnary Studies',
    'Cocoa',
    'Politics',
    'Sports Science',
    'Agriculture',
    'Technology',
    'Design',
    'Gender',
    'Economics',
    'Innovation',
    'Incubators',
    'Globalization'
  ];
  selected: string[] = [];

  constructor(
    private dataService: DataService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    if (this.profile.interests && this.profile.interests.length > 0) {
      this.selected = {...this.profile}.interests;
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  choose(int: string) {
    if (this.selected.includes(int)) {
      this.selected = this.selected.filter(i => i !== int);
    } else {
      this.selected.push(int);
    }
  }

  async save() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.profile.interests = this.selected;
    this.dataService.updateItem('profiles', this.profile);
    this.modalCtrl.dismiss(this.profile);
    loading.dismiss();
  }

}
