import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Person } from 'src/app/models/models';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss'],
})
export class AddPersonComponent implements OnInit {

  @Input() type: string;

  person: Person = {
    userId: null,
    fullName: null,
    title: null,
    email: null,
    telephone: null,
    imageUrl: null
  };

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  async addMedia() {
    // const modal = await this.modalCtrl.create({
    //   component: MediaPage,
    //   cssClass: 'md-wrap',
    //   componentProps: {
    //     asSelector: true
    //   }
    // });
    // await modal.present();
    // const { data } = await modal.onWillDismiss();
    // if (data) {
    //   this.person.imageUrl = data.mediaUrl;
    // }
  }

  async addPerson() {
    await this.modalCtrl.dismiss(this.person);
  }

}
