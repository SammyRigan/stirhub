/* eslint-disable no-underscore-dangle */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ContactsBoxComponent } from 'src/app/components/message-widgets/contacts-box/contacts-box.component';
import { Chat, Thread, UserProfile } from 'src/app/models/models';
import { GeneralService } from 'src/app/services/general.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit, OnDestroy {

  isLoading = true;
  profile: UserProfile;
  year = new Date().getFullYear();

  allThreads: Thread[] = [];
  lastDoc = null;
  empty: boolean;
  subs: Subscription[] = [];
  pop = false;
  thread: Thread = null;
  receiver = null;

  message: Chat = {
    id: null,
    text: null,
    imgUrls: [],
    date: null,
    videoUrl: null,
    senderId: null,
    receiverId: null
  };

  messages: Chat[] = [];

  video: File;
  images: File[] = [];
  msgFile: File;
  tempVidUrl: string;
  tempImgUrls: {
    url: string;
    id: number;
    name: string;
  }[] = [];
  tempFileName: string;

  sending = false;

  constructor(
    private generalService: GeneralService,
    private dataService: DataService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getUserProfile();
  }

  // async getUserProfile() {
  //   this.profile = await this.generalService.getMyProfile();
  //   // console.log(this.profile);
  //   const res = this.generalService.getProfileUpdateListener().subscribe((profile) => {
  //     this.profile = profile;
  //     console.log(this.profile);
  //   });
  //   // if (this.profile.adminId) {
  //   //   this.proType = 'institution';
  //   // } else {
  //   //   this.proType = 'person';
  //   // }
  //   this.subs.push(res);
  //   this.getThreads();
  //   this.isLoading = false;
  // }

  async getUserProfile() {
    this.profile = await this.dataService.getLoggedInProfile();
    if (this.profile) {
      this.getThreads();
      this.isLoading = false;
    }
    const $sub = this.dataService.getUserUpdateListener().subscribe((profile) => {
      this.profile = profile;
      this.getThreads();
      this.isLoading = false;
    });
    this.subs.push($sub);
  }

  async getThreads() {
    const $ref = this.generalService.getMyThreads(this.profile?._id).subscribe(res => {
      this.allThreads = res.map(e => ({
        id: e.payload.doc.id,
        ...e.payload.doc.data() as Thread
      }));
    });
    this.subs.push($ref);
  }

  selectThread(receiver: any, thread: Thread) {
    this.messages = [];
    this.thread = thread;
    this.receiver = receiver;
    this.getMessages();
    this.pop = true;
  }

  getMessages() {
    this.generalService.getMessages(`threads/${this.thread.id}/messages`).subscribe(res => {
      this.messages = res.map(e => ({
        id: e.payload.doc.id,
        ...e.payload.doc.data() as Chat
      }));
    });
    // document.getElementById('chats').scrollTo(0, ) = document.getElementById('chats').scrollHeight;
  }

  readFile(event) {
    if (this.tempImgUrls.length < 4) {
      // console.log(event.target.files);
      this.images.push(event.target.files[0]);
      // const reader = new FileReader();
      const url = URL.createObjectURL(event.target.files[0]);
      this.tempImgUrls.push({url, id: this.tempImgUrls.length, name: event.target.files[0].name});
      // console.log(this.tempImgUrls);
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

  async sendMessage() {
    this.sending = true;
    if (!this.message.text && !this.video && !this.msgFile && this.images.length === 0) {
      return;
    }
    if (this.tempImgUrls.length > 0) {
      for await (const img of this.images) {
        const url = await this.upload(img);
        this.message.imgUrls.push(url);
      }
    }
    if (this.msgFile) {
      this.message.fileUrl = await this.upload(this.msgFile);
    }
    this.message.receiverId = this.receiver._id;
    this.message.senderId = this.profile._id;
    this.message.date = Date.now().toString();
    this.thread.lastMsgDate = Date.now().toString();
    this.thread.messageCount = this.thread.messageCount + 1;
    this.thread.unreadCount = this.thread.unreadCount + 1;
    this.thread.lastMessage = {
      userId: this.profile._id,
      message: this.message.text,
      video: !!this.video,
      image: !!this.images.length,
      file: !!this.message.fileUrl
    };
    console.log('good');
    if (!this.thread.id) {
      this.thread.date = Date.now().toString();
      const threadRef = await this.generalService.addItem('threads', {...this.thread});
      this.thread.id = threadRef.id;
    } else {
      this.generalService.updateItem(`threads/${this.thread.id}`, {...this.thread});
    }
    this.messages.push({...this.message});
    this.generalService.addItem(`threads/${this.thread.id}/messages`, {...this.message});
    this.message = {
      id: null,
      text: null,
      imgUrls: [],
      date: null,
      videoUrl: null,
      senderId: null,
      receiverId: null,
      fileUrl: null
    };
    this.tempImgUrls = [];
    this.tempVidUrl = null;
    this.msgFile = null;
    this.sending = false;
  }

  async contacts() {
    const modal = await this.modalCtrl.create({
      component: ContactsBoxComponent,
      componentProps: {
        profile: this.profile
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      if (this.thread && this.thread.participantIds.includes(data._id)) {
        return;
      }
      let exists: boolean;
      for await(const th of this.allThreads) {
        if (th.participantIds.includes(data._id)) {
          this.thread = th;
          exists = true;
          this.getMessages();
          this.receiver = data;
          this.pop = true;
          break;
        }
      }
      if (exists) {
        return;
      }
      this.messages = [];
      this.thread = {
        id: null,
        date: null,
        participantIds: [this.profile._id, data._id],
        lastMessage: null,
        archived: [],
        messageCount: 0,
        unreadCount: 0,
        lastMsgDate: null
      };
      this.receiver = data;
      // this.getMessages();
      this.pop = true;
      // console.log(3);
    }
  }

  ngOnDestroy() {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }
}
