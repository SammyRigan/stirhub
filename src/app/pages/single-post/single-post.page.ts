/* eslint-disable no-underscore-dangle */
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PosterComponent } from 'src/app/components/shared/poster/poster.component';
import { TimePost, UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.page.html',
  styleUrls: ['./single-post.page.scss'],
})
export class SinglePostPage implements OnInit, OnDestroy {

  profile: UserProfile;
  postOwner: UserProfile;
  // proType: string;
  isLoading = true;
  timePost: TimePost;
  comments: TimePost[] = [];
  empty: boolean;
  lastComment = null;
  doc = {
    id: null,
    type: null,
    imgUrl: null
  };

  subs: Subscription[] = [];

  constructor(
    private generalService: GeneralService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    const postId = this.activatedRoute.snapshot.params.pid;
    this.getPost(postId);
    this.getComments(postId);
    const $sub = this.generalService.deletedPost.subscribe(res => {
      this.comments = this.comments.filter(i => i.id !== res.id);
      this.timePost.comments = this.timePost.comments - 1;
      this.generalService.updateField(`timeline/${this.timePost.id}`, {comments: this.timePost.comments});
    });
    this.subs.push($sub);
  }

  goBack() {
    this.location.back();
  }

  async getUserProfile() {
    this.profile = await this.dataService.getLoggedInProfile();
    if (this.profile) {
      this.doc = {
        id: this.profile._id,
        type: this.profile.iType,
        imgUrl: this.profile.profileImgUrl
      };
      this.isLoading = false;
    }
    const $sub = this.dataService.getUserUpdateListener().subscribe((profile) => {
      if (this.profile && this.profile._id === profile._id) {
        this.profile = profile;
      } else {
        this.profile = profile;
        this.getPostOwner();
      }
      this.doc = {
        id: this.profile._id,
        type: this.profile.iType,
        imgUrl: this.profile.profileImgUrl
      };
      this.isLoading = false;
    });
    this.subs.push($sub);
  }

  getPostOwner() {
    this.postOwner = this.profile;
    // if (!this.profile.name) {

    // }
  }

  async getPost(postId: string) {
    const post = await this.generalService.getSingleItem(`timeline/${postId}`);
    if (post.exists) {
      this.timePost = {
        id: postId,
        ...post.data() as TimePost
      };
    }
    this.getUserProfile();
  }

  async getComments(postId: string) {
    const postsRef = await this.generalService.getPosts('timeline', this.lastComment, null, postId, 20);
    const posts = postsRef.docs.map(e => ({
      id: e.id,
      ...e.data() as TimePost
    }));
    this.comments = this.comments.concat(posts);
    this.empty = postsRef.empty;
    if (!this.empty && posts.length <= 30) {
      this.empty = true;
    }
    if (postsRef.size > 0) {
      this.lastComment = postsRef.docs[postsRef.docs.length - 1];
    }
    // console.log(this.comments, this.timePost.id);
  }

  async getOwner(collection: string, id: string) {
    const profile = await this.generalService.getSingleItem(`${collection}/${id}`);
    this.profile = {
      id: profile.id,
      ...profile.data() as any
    };
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
        }
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if (data && data.repliedTo) {
      this.comments.unshift(data);
    }
  }

  makeComment(event: TimePost) {
    this.comments.unshift(event);
  }

  deletePost(post: TimePost) {
    if (post.id !== this.timePost.id) {
      this.comments = this.comments.filter(i => i.id !== post.id);
      this.timePost.comments = this.timePost.comments - 1;
      this.generalService.updateField(`timeline/${this.timePost.id}`, {comments: this.timePost.comments});
    } else {
      this.goBack();
      this.generalService.deletedPost.next(post);
    }
  }

  ngOnDestroy(): void {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }
}
