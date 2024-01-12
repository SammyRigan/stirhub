/* eslint-disable no-underscore-dangle */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { TimePost, UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';
import { MediaFocusComponent } from '../media-focus/media-focus.component';
import { PosterComponent } from '../poster/poster.component';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent implements OnInit {

  @Input() timePost: TimePost; // CURRENT COMMENT
  // @Input() selectedImg: number;
  @Input() doc: {
    id: string;
    type: string;
    imgUrl: string;
  }; // INFO ON CURRENTLY LOGGED IN USER OR INSTUTUTION
  @Input() profile: UserProfile; // PROFILE OF CURRENTLY LOGGED IN USER OR INSTITUTION
  @Input() postOwner: UserProfile; // OWNER OF POST THAT WAS COMMENTED ON
  @Input() cap: boolean;
  @Output() deleted: EventEmitter<boolean> = new EventEmitter();

  commentorProfile: any; // OWNER OF CURRENT COMMENT

  isLiked = false;
  comments: TimePost[] = [];

  constructor(
    private generalService: GeneralService,
    private dataService: DataService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.checkIfLiked();
    this.getCommentPoster();
    this.getComments();
  }

  async checkIfLiked() {
    const ref = await this.generalService.getSingleItem(`timeline/${this.timePost.id}/likes/${this.doc?.id}`);
    if (ref.exists) {
      this.isLiked = true;
    }
  }

  async getCommentPoster() {
    const res = await this.dataService.getSingleItem('profiles', this.timePost.profileId);
    this.commentorProfile = res.data;
    // let url = `user-profiles/${this.timePost.profileId}`;
    // if (this.timePost.institution) {
    //   url = `institutions/${this.timePost.profileId}`;
    // }
    // const ref = await this.generalService.getSingleItem(url);
    // this.commentorProfile = {
    //   id: ref.id,
    //   ...ref.data() as any
    // };
    // if (this.timePost.institution) {
    //   this.commentorProfile.displayName = this.commentorProfile.name;
    // } else {
    //   this.commentorProfile.displayName = this.commentorProfile.firstname + ' ' + this.commentorProfile.lastname;
    // }
  }

  async getComments() {
    const postsRef = await this.generalService.getPosts('timeline', null, null, this.timePost?.id, 4);
    const posts = postsRef.docs.map(e => ({
      id: e.id,
      ...e.data() as TimePost
    }));
    this.comments = this.comments.concat(posts);
  }

  async like() {
    if (this.isLiked) {
      this.isLiked = false;
      this.timePost.likes = this.timePost.likes - 1;
      await this.generalService.deleteItem(`timeline/${this.timePost.id}/likes/${this.doc?.id}`);
    } else {
      this.isLiked = true;
      this.timePost.likes = this.timePost.likes + 1;
      const like = {
        id: this.doc?.id,
        date: Date.now().toString(),
        type: this.doc?.type
      };
      await this.generalService.docSetter(`timeline/${this.timePost.id}/likes`, like);
    }
    await this.generalService.updateItem(`timeline/${this.timePost.id}`, {likes: this.timePost.likes});
  }

  async comment() {
    const modal = await this.modalCtrl.create({
      component: PosterComponent,
      cssClass: ['auto-height', 'post-wrap'],
      componentProps: {
        timePost: this.timePost,
        postOwner: this.commentorProfile,
        poster: this.doc
      }
    });
    await modal.present();
  }

  async viewMedia(selectedImg: number) {
    const modal = await this.modalCtrl.create({
      component: MediaFocusComponent,
      cssClass: ['bg-wrap', 'trans'],
      componentProps: {
        timePost: this.timePost,
        selectedImg,
        postOwner: this.commentorProfile,
        doc: this.doc
      }
    });
    await modal.present();
  }

  async copyLink() {
    await navigator.clipboard.writeText(`https://community.stein.com.gh/single-post/${this.timePost.id}`);
    const toast = await this.toastCtrl.create({
      message: 'Link Copied',
      duration: 1000
    });
    await toast.present();
  }


  follow() {
    if (!this.profile?.name && !this.commentorProfile.name) {
      this.commentorProfile.followers.push(this.profile._id);
      this.profile.following.push(this.commentorProfile.id);
      this.generalService.updateField(`user-profiles/${this.commentorProfile.id}`, {followers: this.commentorProfile.followers});
      this.generalService.updateField(`user-profiles/${this.profile._id}`, {following: this.profile.following});
    } else {
      this.profile.following.push(this.commentorProfile.id);
      this.commentorProfile.followers.push(this.profile._id);
      this.generalService.updateField(`institutions/${this.profile._id}`, {following: this.profile.following});
      this.generalService.updateField(`institutions/${this.commentorProfile.id}`, {followers: this.commentorProfile.followers});
    }
    this.showToast(`You followed ${this.commentorProfile.displayName}`);
  }

  unfollow() {
    if (!this.profile?.name && !this.commentorProfile.name) {
      this.commentorProfile.followers = this.commentorProfile.followers.filter(i => i !== this.profile._id);
      this.profile.following = this.profile.following.filter(i => i !== this.commentorProfile.id);
      this.generalService.updateField(`user-profiles/${this.commentorProfile.id}`, {followers: this.commentorProfile.followers});
      this.generalService.updateField(`user-profiles/${this.profile._id}`, {following: this.profile.following});
    } else {
      this.profile.following = this.profile.following.filter(i => i !== this.commentorProfile.id);
      this.commentorProfile.followers = this.commentorProfile.followers.filter(i => i !== this.profile._id);
      this.generalService.updateField(`institutions/${this.profile._id}`, {following: this.profile.following});
      this.generalService.updateField(`institutions/${this.commentorProfile.id}`, {followers: this.commentorProfile.followers});
    }
    this.showToast(`You unfollowed ${this.commentorProfile.displayName}`);
  }

  instlike(like: boolean) {
    if (like) {
      this.profile.liked.push(this.commentorProfile.id);
      this.commentorProfile.likedBy.push(this.profile._id);
      this.showToast(`You liked ${this.commentorProfile.displayName}`);
    } else {
      this.profile.liked = this.profile.liked.filter(i => i !== this.commentorProfile.id);
      this.commentorProfile.likedBy = this.commentorProfile.likedBy.filter(i => i !== this.profile._id);
      this.showToast(`You unliked ${this.commentorProfile.displayName}`);
    }
    this.generalService.updateField(`institutions/${this.commentorProfile.id}`, {likedBy: this.commentorProfile.likedBy});
    this.generalService.updateField(`user-profiles/${this.profile._id}`, {liked: this.profile.liked});
  }

  observe(like: boolean) {
    if (like) {
      this.profile.observing.push(this.commentorProfile.id);
      this.commentorProfile.observedBy.push(this.profile._id);
      this.showToast(`You are now observing ${this.commentorProfile.displayName}`);
    } else {
      this.profile.observing = this.profile.observing.filter(i => i !== this.commentorProfile.id);
      this.commentorProfile.observedBy = this.commentorProfile.observedBy.filter(i => i !== this.profile._id);
      this.showToast(`You have stopped observing ${this.commentorProfile.displayName}`);
    }
    this.generalService.updateField(`institutions/${this.profile._id}`, {observing: this.profile.observing});
    this.generalService.updateField(`user-profiles/${this.commentorProfile.id}`, {observedBy: this.commentorProfile.observedBy});
  }

  async reportPost() {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure you want to report this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Report',
          handler: () => {
            this.generalService.addItem('reports', {
              id: null,
              date: Date.now().toString(),
              collection: 'timeline',
              docId: this.timePost.id,
              reporterId: this.timePost.profileId
            });
            this.showToast('Post reported');
          }
        }
      ]
    });
    await alert.present();
  }

  async deletePost() {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.generalService.deleteItem(`timeline/${this.timePost.id}`);
            this.showToast('Post deleted');
            this.deleted.emit(true);
          }
        }
      ]
    });
    await alert.present();
  }


  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000
    });
    await toast.present();
  }
}
