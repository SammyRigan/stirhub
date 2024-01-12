/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-suggestions-modal',
  templateUrl: './suggestions-modal.component.html',
  styleUrls: ['./suggestions-modal.component.scss'],
})
export class SuggestionsModalComponent implements OnInit {

  @Input() profile: UserProfile;
  @Input() sType: string;

  suggestions: UserProfile[] = [];
  instSuggestions: UserProfile[] = [];
  count = 0;
  page = 1;
  iPage = 1;

  // lastPost = null;
  empty: boolean;

  instLastPost = null;
  instEmpty: boolean;

  constructor(
    private generalService: GeneralService,
    private dataService: DataService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    if (this.sType === 'people') {
      this.getSuggestions();
    } else {
      this.getInstSuggestions();
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }


  async getSuggestions() {
    const filters = [{key: 'iType', value: 'individual'}];
    if (!this.profile.name) {
      filters.push({key: 'personId', value: this.profile._id});
    } else {
      filters.push({key: 'instId', value: this.profile._id});
    }
    const res = await this.dataService.returnItemsRaw('profiles', 20, this.page, filters);
    this.suggestions = this.suggestions.concat(res.data);
    this.suggestions = this.suggestions.filter(s => s._id !== this.profile._id);
    this.page += 1;
  }

  async getInstSuggestions() {
    const filters = [{key: 'iType', value: 'institution'}];
    if (!this.profile.name) {
      filters.push({key: 'personId', value: this.profile._id});
    } else {
      filters.push({key: 'instId', value: this.profile._id});
    }
    const res = await this.dataService.returnItemsRaw('profiles', 20, this.page, filters);
    this.instSuggestions = this.instSuggestions.concat(res.data);
    this.instSuggestions = this.instSuggestions.filter(s => s._id !== this.profile._id);
    this.iPage += 1;
  }

}
