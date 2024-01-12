/* eslint-disable no-underscore-dangle */
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';
import { SuggestionsModalComponent } from './suggestions-modal/suggestions-modal.component';

@Component({
  selector: 'app-suggestion-widget',
  templateUrl: './suggestion-widget.component.html',
  styleUrls: ['./suggestion-widget.component.scss'],
})
export class SuggestionWidgetComponent implements OnInit {

  @Input() profile: UserProfile;

  suggestions: UserProfile[] = [];
  instSuggestions: UserProfile[] = [];

  constructor(
    private generalService: GeneralService,
    private dataService: DataService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getSuggestions();
    this.getInstSuggestions();
  }

  async getSuggestions() {
    const ref = await this.dataService.returnItemsRaw('profiles', 10, 1, [{key: 'iType', value:'individual'}]);
    this.suggestions = ref.data;
    this.suggestions = this.suggestions.filter(s => s._id !== this.profile._id);
    // this.suggestions = ref.docs.map(e => ({
    //   id: e.id,
    //   ...e.data() as UserProfile
    // }));
    // this.suggestions = this.suggestions.filter(s => s._id !== this.profile._id);
    if (this.profile.name) {
      this.suggestions = this.suggestions.filter(s => !this.profile.observing.includes(s._id));
    } else {
      this.suggestions = this.suggestions.filter(s => !this.profile.following.includes(s._id));
    }
  }

  async getInstSuggestions() {
    const ref = await this.dataService.returnItemsRaw('profiles', 10, 1, [{key: 'iType', value:'institution'}]);
    this.instSuggestions = ref.data;
    this.instSuggestions = this.instSuggestions.filter(s => s._id !== this.profile._id);
    if (this.profile.name) {
      this.instSuggestions = this.instSuggestions.filter(s => !this.profile.following.includes(s._id));
    } else {
      this.instSuggestions = this.instSuggestions.filter(s => !this.profile.liked.includes(s._id));
    }
  }

  async viewAll(type: string) {
    const modal = await this.modalCtrl.create({
      component: SuggestionsModalComponent,
      componentProps: {
        profile: this.profile,
        sType: type
      }
    });
    await modal.present();
  }

}
