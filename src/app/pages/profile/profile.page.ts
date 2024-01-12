/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { CreateEventComponent } from 'src/app/components/event-widgets/create-event/create-event.component';
import { EducationComponent } from 'src/app/components/profile-builder-widgets/education/education.component';
import { ExperienceComponent } from 'src/app/components/profile-builder-widgets/experience/experience.component';
import { CreateAnnouncementComponent } from 'src/app/components/shared/create-announcement/create-announcement.component';
import { FollowingComponent } from 'src/app/components/shared/following/following.component';
import { InterestsSelectComponent } from 'src/app/components/shared/interests-select/interests-select.component';
import { PosterComponent } from 'src/app/components/shared/poster/poster.component';
import { ResearchComponent } from 'src/app/components/shared/research/research.component';
import { TimePost, UserProfile, Publication, Research, IEvent } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userProfile: UserProfile; // CURRENTLY LOGGED IN USER
  profile: UserProfile; // PROFILE BEING VIEWED
  view = 'overview';
  timePosts: TimePost[] = [];
  comments: TimePost[] = [];
  announcements: TimePost[] = [];
  iEvents: IEvent[] = [];
  publications: Publication[] = [];
  researches: Research[] = [];

  lastPost = null;
  lastPub = null;
  lastRes = null;
  lastComment = null;
  empty: boolean;
  emptyPub: boolean;
  emptyRes: boolean;
  emptyC: boolean;
  // viewed = false;
  // viewedC = false;

  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private generalService: GeneralService,
    private dataService: DataService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    // this.getUserProfile();
    const proId = this.activatedRoute.snapshot.params.pid;
    this.getProfile(proId);
  }

  async getUserProfile() {
    this.userProfile = await this.dataService.getLoggedInProfile();
    if (this.userProfile) {
      this.isLoading = false;
    }
    this.dataService.getUserUpdateListener().subscribe((profile) => {
      this.userProfile = profile;
      this.isLoading = false;
    });
  }

  async getProfile(id: string) {
    const res = await this.dataService.getSingleItem('profiles', id);
    this.profile = res.data;
    // this.isLoading = false;
    // console.log(this.profile);
    this.getUserProfile();
    this.getResearches();
    this.getPublications();
    this.getPosts();
    this.getComments();
    if (this.profile.name) {
      this.getEvents();
      this.getAnnouncements();
    }
  }

  async getPublications() {
    // let instId = null;
    // let proId = null;
    // if (this.profile?.adminId) {
    //   instId = this.profile?._id;
    // } else {
    //   proId = this.profile?._id;
    // }
    // const ref = await this.generalService.getPapers('publications', this.lastPub, 10, proId, instId);
    // const publications = ref.docs.map(e => ({
    //   id: e._id,
    //   ...e.data() as Publication
    // }));
    // this.publications = this.publications.concat(publications);
    // this.emptyPub = ref.empty;
    // if (!this.emptyPub && publications.length <= 20) {
    //   this.emptyPub = true;
    // }
    // if (ref.size > 0) {
    //   this.lastPub = ref.docs[ref.docs.length - 1];
    // }
  }

  async getResearches() {
    // let instId = null;
    // let proId = null;
    // if (this.profile?.adminId) {
    //   instId = this.profile?._id;
    // } else {
    //   proId = this.profile?._id;
    // }
    // const ref = await this.generalService.getPapers('researches', this.lastRes, 10, proId, instId);
    // const researches = ref.docs.map(e => ({
    //   id: e._id,
    //   ...e.data() as Research
    // }));
    // this.researches = this.researches.concat(researches);
    // this.emptyRes = ref.empty;
    // if (!this.emptyRes && researches.length <= 20) {
    //   this.emptyRes = true;
    // }
    // if (ref.size > 0) {
    //   this.lastRes = ref.docs[ref.docs.length - 1];
    // }
  }

  async loadData(event) {
    setTimeout(async () => {
      await this.getPublications();
      await event.target.complete();

      if (this.empty) {
        event.target.disabled = true;
      }
    }, 500);
  }

  async getAnnouncements() {
    const res = await this.generalService
    .getItemWithFilter('timeline', null, [{key: 'profileId', value: this.profile._id}, {key: 'announcement', value: true}], 5);
    this.announcements = res.docs.map(e => ({
      id: e.id,
      ...e.data() as TimePost
    }));
  }

  async getPosts() {
    const postsRef = await this.generalService.getPosts('timeline', this.lastPost, this.profile?._id, null, 10);
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

  async getComments() {
    const postsRef = await this.generalService.getMyReplies('timeline', this.lastComment, this.profile?._id, 10);
    const posts = postsRef.docs.map(e => ({
      id: e.id,
      ...e.data() as TimePost
    }));
    this.comments = this.comments.concat(posts);
    this.emptyC = postsRef.empty;
    if (!this.emptyC && posts.length <= 30) {
      this.emptyC = true;
    }
    if (postsRef.size > 0) {
      this.lastComment = postsRef.docs[postsRef.docs.length - 1];
    }
  }

  async getEvents() {
    const res = await this.dataService.returnItemsRaw('events', 6, 1, [{key: 'profileId', value: this.profile._id}]);
    this.iEvents = res.data;
  }

  async education(educationInfo) {
    const modal = await this.modalCtrl.create({
      component: EducationComponent,
      cssClass: 'profile',
      componentProps: {
        profile: {...this.profile},
        educationInfo
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.profile = data;
    }
  }

  async experience(workInfo) {
    const modal = await this.modalCtrl.create({
      component: ExperienceComponent,
      cssClass: ['profile'],
      componentProps: {
        profile: {...this.profile},
        workInfo
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.profile = data;
    }
  }

  async makePost() {
    const modal = await this.modalCtrl.create({
      component: PosterComponent,
      cssClass: ['auto-height', 'post-wrap'],
      componentProps: {
        poster: {
          id: this.userProfile._id,
          type: this.userProfile.iType,
          imgUrl: this.userProfile.profileImgUrl
        },
        profile: this.userProfile
      }
    });
    await modal.present();
  }

  async editProfile() {
    const modal = await this.modalCtrl.create({
      component: EditProfileComponent,
      componentProps: {
        profile: {...this.profile}
      }
    });
    await modal.present();
    const data = await modal.onWillDismiss();
    if (data.data) {
      this.profile = data.data;
    }
  }

  async editInterests() {
    const modal = await this.modalCtrl.create({
      component: InterestsSelectComponent,
      componentProps: {
        profile: {...this.profile}
      }
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data) {
      this.profile = data;
    }
  }

  async makeAnnouncement() {
    const modal = await this.modalCtrl.create({
      component: CreateAnnouncementComponent,
      componentProps: {
        profileId: this.userProfile._id
      }
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data) {
      this.announcements.unshift(data);
    }
  }

  async addEvent() {
    const modal = await this.modalCtrl.create({
      component: CreateEventComponent,
      componentProps: {
        profile: {...this.userProfile}
      }
    });
    await modal.present();
    const {data} = await modal.onWillDismiss();
    if (data) {
      this.iEvents.unshift(data);
    }
  }

  async createResearch() {
    const modal = await this.modalCtrl.create({
      component: ResearchComponent,
      // cssClass: ,
      componentProps: {
        poster: {
          id: this.profile._id,
          type: this.profile.name ? 'institution' : 'user-profile',
          imgUrl: this.profile.profileImgUrl
        },
        profile: this.userProfile
      }
    });
    await modal.present();
  }

  async getFollowingAdmin(profileId: string) {
    const ref = await this.dataService.getSingleItem('profiles', profileId);
    return ref.data();
  }

  follow() {
    this.profile.followers.push(this.userProfile._id);
    this.userProfile.following.push(this.profile._id);
    this.dataService.updateItem('profiles', this.profile);
    this.dataService.updateItem('profiles', this.userProfile);
  }

  unfollow() {
    this.profile.followers = this.profile.followers.filter(i => i !== this.userProfile._id);
    this.userProfile.following = this.userProfile.following.filter(i => i !== this.profile._id);
    this.dataService.updateItem('profiles', this.profile);
    this.dataService.updateItem('profiles', this.userProfile);
  }

  like() {
    this.userProfile.liked.push(this.profile._id);
    this.profile.likedBy.push(this.userProfile._id);
    this.dataService.updateItem('profiles', this.profile);
    this.dataService.updateItem('profiles', this.userProfile);
  }

  unlike() {
    this.userProfile.liked = this.userProfile.liked.filter(i => i !== this.profile._id);
    this.profile.likedBy = this.profile.likedBy.filter(i => i !== this.userProfile._id);
    this.dataService.updateItem('profiles', this.profile);
    this.dataService.updateItem('profiles', this.userProfile);
  }

  observe() {
    this.userProfile.observing.push(this.profile._id);
    this.profile.observedBy.push(this.userProfile._id);
    this.dataService.updateItem('profiles', this.profile);
    this.dataService.updateItem('profiles', this.userProfile);
  }

  unobserve() {
    this.userProfile.observing = this.userProfile.observing.filter(i => i !== this.profile._id);
    this.profile.observedBy = this.profile.observedBy.filter(i => i !== this.userProfile._id);
    this.dataService.updateItem('profiles', this.profile);
    this.dataService.updateItem('profiles', this.userProfile);
  }

  ifollow() {
    this.userProfile.following.push(this.profile._id);
    this.profile.followers.push(this.userProfile._id);
    this.dataService.updateItem('profiles', this.profile);
    this.dataService.updateItem('profiles', this.userProfile);
  }

  iunfollow() {
    this.userProfile.following = this.userProfile.following.filter(i => i !== this.profile._id);
    this.profile.followers = this.profile.followers.filter(i => i !== this.userProfile._id);
    this.dataService.updateItem('profiles', this.profile);
    this.dataService.updateItem('profiles', this.userProfile);
  }

  async viewClout(ids: string[], collection: string, title: string) {
    const modal = await this.modalCtrl.create({
      component: FollowingComponent,
      componentProps: {
        profileIds: ids,
        profile: this.profile,
        collection,
        title
      }
    });
    await modal.present();
  }
}
