/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, PickerController } from '@ionic/angular';
import { PostPoll, TimePost, UserProfile } from 'src/app/models/models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss'],
})
export class CreatePollComponent implements OnInit {

  @Input() profile: UserProfile;

  poll: PostPoll = {
    id: null,
    date: null,
    question: null,
    options: [],
    duration: [],
    dueDate: null,
    responses: [],
    closed: false,
    profileId: null
  };

  option = {
    index: 0,
    value: null,
    amount: 0
  };

  newPost: TimePost = {
    id: null,
    date: null,
    likes: 0,
    shares: 0,
    comments: 0,
    imgUrls: [],
    repliedTo: null,
    profileId: null,
    text:  null
  };

  duration = [];

  constructor(
    private generalService: GeneralService,
    private pickerCtrl: PickerController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  addOption() {
    if (!this.option.value || !this.option.value.trim()) {
      return;
    }
    this.poll.options.push({...this.option});
    this.option.index++;
    this.option.value = null;
  }

  generateNumbers(n: number) {
    let i=0;
    const a=Array(n);
    while(i<n) {a[i++]=i;}
    return a;
  }

  async openPicker() {
    const days = [{text: '0', value: 0}];
    const hours = [{text: '0', value: 0}];
    const minutes = [{text: '0', value: 0}];
    for (const num of this.generateNumbers(7)) {
      const it = {
        text: num.toString(),
        value: num
      };
      days.push(it);
    }
    for (const num of this.generateNumbers(23)) {
      const it = {
        text: num.toString(),
        value: num
      };
      hours.push(it);
    }
    for (const num of this.generateNumbers(59)) {
      const it = {
        text: num.toString(),
        value: num
      };
      minutes.push(it);
    }
    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'days',
          options: days,
          suffix: 'days'
        },
        {
          name: 'hours',
          options: hours,
          suffix: 'hrs'
        },
        {
          name: 'minutes',
          options: minutes,
          suffix: 'mins'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (value) => {
            this.poll.duration = [value.days.value, value.hours.value, value.minutes.value];
          },
        },
      ],
    });

    await picker.present();
  }

  calcDate(days: number, hours: number, minutes: number) {
    const today = new Date();
    const stand = (days * 1440) + (hours * 60) + minutes;
    const dueDate = new Date(today.getTime() + stand * 60000);
    return dueDate.toString();
  }

  async addPoll() {
    if (!this.poll.question || !this.poll.question.trim()) {
      return;
    }
    const loading = await this.loadingCtrl.create();
    await loading.present();
    for (const opt of this.poll.options) {
      if (!opt.value || !opt.value.trim()) {
        this.poll.options = this.poll.options.filter(i => i.index !== opt.index);
      }
    }
    if (this.poll.options.length < 2) {
      return;
    }
    this.poll.date = Date.now().toString();
    this.poll.profileId = this.profile._id;
    this.poll.dueDate = this.calcDate(this.poll.duration[0], this.poll.duration[1], this.poll.duration[2]);
    this.newPost.date = Date.now().toString();
    this.newPost.text = this.poll.question;
    this.newPost.profileId = this.profile._id;
    const pollRef = await this.generalService.addItem('polls', this.poll);
    this.newPost.pollId = pollRef.id;
    const postRef = await this.generalService.addItem('timeline', this.newPost);
    this.newPost.id = postRef.id;
    this.modalCtrl.dismiss(this.newPost);
    loading.dismiss();
  }

}
