import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { IEvent, Publication, Research, TimePost, UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searching = false;
  query = null;
  isLoading = true;
  profile: UserProfile;
  people: UserProfile[] = [];
  institutions: UserProfile[] = [];
  researches: Research[] = [];
  publications: Publication[] = [];
  peopleRes = [];
  institutionsRes = [];
  researchesRes = [];
  publicationsRes = [];
  iEvents: IEvent[] = [];
  announcements: TimePost[] = [];
  communities = [];

  constructor(
    private generalService: GeneralService,
    private dataService: DataService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    // this.lockPage();
    this.getUserProfile();
    this.getEvents();
    this.getAnnouncements();
    this.getCommunities();
    this.getPeople();
    this.getInstitions();
    this.getResearches();
    // this.getPublications();
  }

  async lockPage() {
    const alert = await this.alertCtrl.create({
      message: 'This page is closed for maintainance',
      // backdropDismiss: false
    });
    await alert.present();
  }

  async search() {
    this.searching = true;
    this.peopleRes = await this.generalService.search('user-profiles', this.query);
    this.institutionsRes = await this.generalService.search('institutions', this.query);
    this.researchesRes = await this.generalService.search('researches', this.query);
    this.publicationsRes = await this.generalService.search('publications', this.query);
    this.searching = false;
  }

  // async getUserProfile() {
  //   this.profile = await this.generalService.getMyProfile();
  //   // console.log(this.profile);
  //   this.generalService.getProfileUpdateListener().subscribe((profile) => {
  //     this.profile = profile;
  //     console.log(this.profile);
  //   });
  // }

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

  async getEvents() {
    const res = await this.dataService.returnItemsRaw('events', 3, 1, []);
    this.iEvents = res.data;
  }

  async getAnnouncements() {
    const res = await this.generalService
    .getItemWithFilter('timeline', null, [{key: 'announcement', value: true}], 50);
    this.announcements = res.docs.map(e => ({
      id: e.id,
      ...e.data() as TimePost
    }));
  }

  async getCommunities() {
    const res = await this.dataService.returnItemsRaw('communities', 3, 1, []);
    this.communities = res.data;
  }

  async getPeople() {
    const res = await this.dataService.returnItemsRaw('profiles', 3, 1, [{key: 'iType', value: 'individual'}]);
    this.people = res.data;
  }

  async getInstitions() {
    const res = await this.dataService.returnItemsRaw('profiles', 3, 1, [{key: 'iType', value: 'institution'}]);
    this.institutions = res.data;
  }

  async getResearches() {
    const res = await this.dataService.returnItemsRaw('researches', 3, 1, []);
    this.researches = res.data;
  }

  async getPublications() {
    const ref = await this.generalService.getItems('publications', null, 4);
    this.publications = ref.docs.map(e => ({
      id: e.id,
      ...e.data() as Publication
    }));
    this.isLoading = false;
  }

  deletePost(id: string) {
    this.announcements = this.announcements.filter(i => i.id !== id);
  }

}
