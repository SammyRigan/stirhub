import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {

  @Input() profile: UserProfile;

  proImg: File;
  bannerImg: File;
  tempUri = null;
  tempBannerUri = null;
  add = false;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private dataService: DataService
  ) { }

  ngOnInit() {
    if (!this.profile.address) {
      this.profile.address = {lat: null, lng: null, address: null};
    }
    console.log(this.profile.bannerUrl);
  }

  formatUsername() {
    this.profile.username = this.profile.username.replace(/\s/g, '');
  }

  async save() {
    this.add = true;
    const loading = await this.loadingCtrl.create();
    await loading.present();
    const storage = getStorage();
    if (this.proImg) {
      const storageRef = ref(storage, Date.now().toString() + `${this.proImg.name}`);
      await uploadBytes(storageRef, this.proImg);
      const proUrl = await getDownloadURL(storageRef);
      this.profile.profileImgUrl = proUrl;
    }
    if (this.bannerImg) {
      const storageRef = ref(storage, Date.now().toString() + `${this.bannerImg.name}`);
      await uploadBytes(storageRef, this.bannerImg);
      const bannerUrl = await getDownloadURL(storageRef);
      this.profile.bannerUrl = bannerUrl;
    }
    this.dataService.updateItem('profiles', {...this.profile});
    await this.modalCtrl.dismiss(this.profile);
    await loading.dismiss();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  readFile(event, mode: string) {
    if (mode === 'profile') {
      this.proImg = event.target.files[0];
      this.tempUri = URL.createObjectURL(event.target.files[0]);
    } else {
      this.bannerImg = event.target.files[0];
      this.tempBannerUri = URL.createObjectURL(event.target.files[0]);
    }
    event.target.value = '';
  }

  removeBanner() {
    this.bannerImg = null;
    this.tempBannerUri = null;
    this.profile.bannerUrl = null;
  }

}
