/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  profile: UserProfile;
  people: UserProfile[] = [];
  institutions: UserProfile[] = [];
  col = null;
  pPage = 1;
  iPage = 1;
  isLoading = true;

  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.col = this.activatedRoute.snapshot.params.col;
    this.getUserProfile();
    this.getItems(this.col);
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

  async getItems(col: string) {
    // let filter;
    // if (col === 'individual')
    const res = await this.dataService.returnItemsRaw('profiles', null, (col === 'individual' ? this.pPage : this.iPage), [{key: 'iType', value: col}]);
    if (col === 'individual') {
      this.people = this.people.concat(res.data);
      this.pPage += 1;
    } else {
      this.iPage += 1;
      this.institutions = this.institutions.concat(res.data);
    }
  }

  addInvites() {
    for (const user of this.people) {
      user.invitesSent = 0;
      user.invitesSignedUp = 0;
      this.dataService.updateItem('profiles', user);
    }
  }

}
