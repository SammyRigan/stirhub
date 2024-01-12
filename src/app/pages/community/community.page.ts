/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TimePost, UserProfile } from 'src/app/models/models';
import { GeneralService } from 'src/app/services/general.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ModalController } from '@ionic/angular';
import { PosterComponent } from 'src/app/components/shared/poster/poster.component';
import { CreatePollComponent } from 'src/app/components/shared/create-poll/create-poll.component';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
 // proType: string; // PERSON OR INSTITUTION
 profile: UserProfile;
 isLoading = true;

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

 postImgs: File[] = [];
 postVid: File = null;

 tempUri = [];
 tempVidUrl = null;

 posting = false;

 timePosts: TimePost[] = [];
 lastPost = null;
 empty: boolean;

 community;

 constructor(
   private generalService: GeneralService,
   private dataService: DataService,
   private sanitizer: DomSanitizer,
   private modalCtrl: ModalController,
   private activatedRoute: ActivatedRoute
 ) { }

 async ngOnInit() {
   this.getUserProfile();
   const comId = await this.activatedRoute.snapshot.params.pid;
   this.getCommunity(comId);
   await this.getPosts(comId);
 }

 async getUserProfile() {
   this.profile = await this.dataService.getLoggedInProfile();
   if (this.profile) {
     this.isLoading = false;
   }
   this.dataService.getUserUpdateListener().subscribe((profile) => {
     this.profile = profile;
     this.isLoading = false;
     // if (this.profile && this.profile._id === profile._id) {
     //   this.profile = profile;
     // } else {
     //   this.profile = profile;
     //   this.getAssets();
     // }
   });
 }

 // async getInstitution() {
 //   const inst = await this.generalService.getSingleItem()
 // }

 async getCommunity(comId: string) {
  const res = await this.dataService.getSingleItem('communities', comId);
  this.community = res.data;
 }

 async getPosts(comId: string) {
   const postsRef = await this.generalService.getPosts(`community${comId}`, this.lastPost, null, null, 30);
   const posts = postsRef.docs.map(e => ({
     id: e.id,
     ...e.data() as TimePost
   }));
   this.timePosts = this.timePosts.concat(posts);
   this.empty = postsRef.empty;
   if (!this.empty && posts.length <= 30) {
     this.empty = true;
   }
   if (postsRef.size > 0) {
     this.lastPost = postsRef.docs[postsRef.docs.length - 1];
   }
 }

 async addPost() {
   this.posting = true;
   if ((!this.newPost.text || !this.newPost.text.trim()) && !this.tempVidUrl && this.tempUri.length === 0) {
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
   this.newPost.profileId = this.profile._id;
   if (this.profile.iType === 'institution') {
     this.newPost.institution = true;
   }
   const postRef = await this.generalService.addItem(`community${this.community._id}`, this.newPost);
   this.newPost.id = postRef.id;
   this.timePosts.unshift(this.newPost);
   this.newPost = {
     id: null,
     date: null,
     likes: 0,
     shares: 0,
     comments: 0,
     imgUrls: [],
     videoUrl: null,
     repliedTo: null,
     profileId: null,
     text: null
   };
   this.postImgs = [];
   this.postVid = null;
   this.tempUri = [];
   this.tempVidUrl = null;
   this.posting = false;
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

 async makePost() {
   const modal = await this.modalCtrl.create({
     component: PosterComponent,
     cssClass: ['auto-height', 'post-wrap'],
     componentProps: {
       poster: {
         id: this.profile._id,
         type: this.profile.iType,
         imgUrl: this.profile.profileImgUrl
       },
       profile: this.profile
     }
   });
   await modal.present();
   const { data } = await modal.onDidDismiss();
   if (data) {
     this.timePosts.unshift(data);
   }
 }

 deletePost(id: string) {
   this.timePosts = this.timePosts.filter(i => i.id !== id);
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
   if (data) {
     this.timePosts.unshift(data);
   }
 }


}
