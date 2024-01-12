/* eslint-disable no-underscore-dangle */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { TimePost, UserProfile, iReport, PostPoll } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';
import { MediaFocusComponent } from '../media-focus/media-focus.component';
import { PosterComponent } from '../poster/poster.component';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit {

  @Input() timePost: TimePost;
  @Input() profile: UserProfile; // CURRENTLY LOGGED IN USER
  // @Input() institution: Institution;
  @Output() deleted: EventEmitter<boolean> = new EventEmitter();
  @Output() commented: EventEmitter<TimePost> = new EventEmitter();

  mainPost: TimePost;
  item: UserProfile; // POST OWNER
  secItem: UserProfile;
  isLiked = false;
  doc = {
    id: null,
    type: null,
    imgUrl: null
  };
  displayName: string;

  poll: PostPoll;
  due: string;
  voted = null;

  constructor(
    private generalService: GeneralService,
    private dataService: DataService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.doc = {
      id: this.profile._id,
      type: this.profile.iType,
      imgUrl: this.profile.profileImgUrl
    };
    this.getPoster();
    this.checkIfLiked();
    this.getPoll();
    this.getPost();
  }

  async getPost() {
    if (this.timePost?.repliedTo) {
      const res = await this.generalService.getSingleItem(`timeline/${this.timePost.repliedTo}`);
      this.mainPost = {
        id: res.id,
        ...res.data() as TimePost
      };
      this.getMainPoster();
    }
  }

  async getPoll() {
    if (!this.timePost.pollId) {
      return;
    }
    const pollRef = await this.generalService.getSingleItem(`polls/${this.timePost.pollId}`);
    this.poll = {
      id: pollRef.id,
      ...pollRef.data() as PostPoll
    };
    this.due = new Date(this.poll.dueDate).getTime().toString();
    this.checkVoted();
  }

  async getPoster() {
    const res = await this.dataService.getSingleItem('profiles', this.timePost.profileId);
    this.item = res.data;
    if (this.timePost.institution) {
      this.displayName = this.item.name;
    } else {
      this.displayName = this.item.firstname + ' ' + this.item.lastname;
    }
  }

  async getMainPoster() {
    const res = await this.dataService.getSingleItem('profiles', this.mainPost.profileId);
    this.secItem = res.data;
  }

  async checkIfLiked() {
    const ref = await this.generalService.getSingleItem(`timeline/${this.timePost.id}/likes/${this.doc?.id}`);
    if (ref.exists) {
      this.isLiked = true;
    }
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
        postOwner: this.item,
        poster: this.doc
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.repliedTo) {
      this.commented.emit(data);
    }
  }

  async viewMedia(selectedImg: number) {
    const modal = await this.modalCtrl.create({
      component: MediaFocusComponent,
      cssClass: ['bg-wrap', 'trans'],
      componentProps: {
        timePost: this.timePost,
        selectedImg,
        postOwner: this.item,
        profile: this.profile,
        doc: this.doc // INFO ABOUT CURRENTLY LOGGED IN USER
      }
    });
    await modal.present();
  }

  async copyLink() {
    await navigator.clipboard.writeText(`https://community.stein.com.gh/single-post/${this.timePost.id}`);
    this.showToast('Link copied');
  }

  follow(item: UserProfile) {
    this.profile.following.push(item._id);
    item.followers.push(this.profile._id);
    this.dataService.updateItem('profiles', item);
    this.dataService.updateItem('profiles', this.profile);
    this.showToast(`You followed ${item.name? item.name : item.firstname + ' ' + item.lastname}`);
  }

  unfollow(item: UserProfile) {
    this.profile.following = this.profile.following.filter(i => i !== item._id);
    item.followers = item.followers.filter(i => i !== this.profile._id);
    this.dataService.updateItem('profiles', item);
    this.dataService.updateItem('profiles', this.profile);
    this.showToast(`You unfollowed ${item.name? item.name : item.firstname + ' ' + item.lastname}`);
  }

  instlike(like: boolean, item: UserProfile) {
    if (like) {
      this.profile.liked.push(item._id);
      item.likedBy.push(this.profile._id);
      this.showToast(`You liked ${item.name? item.name : item.firstname + item.lastname}`);
    } else {
      this.profile.liked = this.profile.liked.filter(i => i !== item._id);
      item.likedBy = item.likedBy.filter(i => i !== this.profile._id);
      this.showToast(`You unliked ${item.name? item.name : item.firstname + ' ' + item.lastname}`);
    }
    this.dataService.updateItem('profiles', item);
    this.dataService.updateItem('profiles', this.profile);
  }

  observe(like: boolean, item: UserProfile) {
    if (like) {
      this.profile.observing.push(item._id);
      item.observedBy.push(this.profile._id);
      this.showToast(`You are now observing ${this.displayName}`);
    } else {
      this.profile.observing = this.profile.observing.filter(i => i !== item._id);
      item.observedBy = item.observedBy.filter(i => i !== this.profile._id);
      this.showToast(`You have stopped observing ${item.name? item.name : item.firstname + ' ' + item.lastname}`);
    }
    this.dataService.updateItem('profiles', item);
    this.dataService.updateItem('profiles', this.profile);
  }

  // unobserve() {
  //   this.profile.observing = this.profile.observing.filter(i => i !== this.item.id);
  //   this.item.observedBy = this.item.observedBy.filter(i => i !== this.profile.id);
  //   this.generalService.updateField(`institutions/${this.profile.id}`, {observing: this.profile.observing});
  //   this.generalService.updateField(`user-profiles/${this.item.id}`, {observedBy: this.item.observedBy});
  // }

  // ifollow() {
  // }

  // iunfollow() {
  // }

  async reportPost(post: TimePost) {
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
              docId: post.id,
              reporterId: post.profileId
            });
            this.showToast('Post reported');
          }
        }
      ]
    });
    await alert.present();
  }

  async deletePost(post: TimePost) {
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
            this.generalService.deleteItem(`timeline/${post.id}`);
            this.showToast('Post deleted');
            this.deleted.emit(true);
            if (this.timePost.pollId) {
              this.generalService.deleteItem(`polls/${post.pollId}`);
            }
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

  vote(opt: {index: number; value: string; amount: number}) {
    opt.amount = opt.amount + 1;
    this.poll.options.find(i => i.index === opt.index).amount = opt.amount;
    this.poll.responses.push({profileId: this.profile._id, optionIndex: opt.index});
    this.generalService.updateItem(`polls/${this.poll.id}`, this.poll);
    this.checkVoted();
  }

  checkVoted() {
    if (this.profile._id === this.timePost.profileId) {
      return;
    }
    const voter = this.poll.responses.find(i => i.profileId === this.profile._id);
    if (voter) {
      this.voted = voter;
    }
  }

  returnWhole(num: number) {
    return Math.round(num);
  }


}
