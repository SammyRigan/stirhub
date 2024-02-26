import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimePost, UserProfile } from 'src/app/models/models';
import { GeneralService } from 'src/app/services/general.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ResearchComponent } from '../research/research.component';
import { CreatePollComponent } from '../create-poll/create-poll.component';

@Component({
  selector: 'app-poster',
  templateUrl: './poster.component.html',
  styleUrls: ['./poster.component.scss'],
})
export class PosterComponent implements OnInit {

  @Input() timePost: TimePost;
  @Input() postOwner: any;
  @Input() poster: {
    id: string;
    type: string;
    imgUrl: string;
  }; // INFO ON CURRENTLY LOGGED IN USER
  @Input() profile: UserProfile;

  newPost: TimePost = {
    id: null,
    date: null,
    likes: 0,
    shares: 0,
    comments: 0,
    imgUrls: [],
    repliedTo: null,
    text: null,
    profileId: null
  };

  postImgs: File[] = [];
  postVid: File = null;

  tempUri = [];
  tempVidUrl = null;

  posting = false;

  constructor(
    private generalService: GeneralService,
    private sanitizer: DomSanitizer,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log(this.poster);
    // this.timePost.imgUrls.indexOf
  }

  async close() {
    this.modalCtrl.dismiss();
  }

  async addPost() {
    this.posting = true;
    if (!this.newPost.text?.trim() && !this.tempVidUrl && this.tempUri.length === 0) {
      return;
    }
    if (this.postVid) {
      this.newPost.videoUrl = await this.upload(this.postVid);
    }
    if (this.postImgs) {
      for await (const img of this.postImgs) {
        const url = await this.upload(img);
        this.newPost.imgUrls.push(url);
      }
    }
    this.newPost.date = Date.now().toString();
    this.newPost.repliedTo = this.timePost ? this.timePost.id : null;
    this.newPost.profileId = this.poster.id;
    if (this.poster.type === 'institution') {
      this.newPost.institution = true;
    }
    const postRef = await this.generalService.addItem('timeline', this.newPost);
    if (this.timePost) {
      this.timePost.comments = this.timePost.comments + 1;
      await this.generalService.updateItem(`timeline/${this.timePost.id}`, {comments: this.timePost.comments});
    }
    this.newPost.id = postRef.id;
    // this.newPost = {
    //   id: null,
    //   date: null,
    //   likes: 0,
    //   shares: 0,
    //   comments: 0,
    //   imgUrls: [],
    //   videoUrl: null,
    //   repliedTo: null,
    //   institutionId: null,
    //   profileId: null,
    //   text: null
    // };
    this.modalCtrl.dismiss(this.newPost);
    // this.postImgs = [];
    // this.postVid = null;
    // this.tempUri = [];
    // this.tempVidUrl = null;
    // this.posting = false;
  }

  readFile(event) {
    if (this.tempUri.length < 4) {
      console.log(event.target.files);
      this.postImgs.push(event.target.files[0]);
      // const reader = new FileReader();
      const url = URL.createObjectURL(event.target.files[0]);
      this.tempUri.push(url);
      console.log(this.tempUri);
    }
    event.target.value = '';
  }

  removeImg(url: string) {
    const index = this.tempUri.indexOf(url);
    this.postImgs.splice(index, 1);
    this.tempUri.splice(index, 1);
  }

  readVid(event) {
    const file = event.target.files[0];
    if (file.size <= 1000000000) {
      // console.log(event.target.files[0]);
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = url;
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        // console.log(video.duration);
        if (video.duration <= 1800) {
          this.tempVidUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
          this.postVid = file;
        }
      };
    }
    event.target.value = '';
  }


  async upload(file: File) {
    // Create a root reference
    const storage = getStorage();

    // Create a reference to 'mountains.jpg'
    // const storageRef = ref(, 'some-child');
    const storageRef = ref(storage, Date.now().toString() + `${file.name}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  }

  async research() {
    const modal = await this.modalCtrl.create({
      component: ResearchComponent,
      cssClass: 'bg-wrap',
      componentProps: {
        poster: this.poster
      }
    });
    await this.modalCtrl.dismiss();
    await modal.present();
  }

  async addPoll() {
    const modal = await this.modalCtrl.create({
      component: CreatePollComponent,
      componentProps: {
        profile: this.profile
      }
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    // if (data) {
    //   this.timePosts.unshift(data);
    // }
  }

}
