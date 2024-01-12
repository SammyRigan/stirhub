import { Component, Input, OnInit } from '@angular/core';
import { UserProfile } from 'src/app/models/models';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-profile-block',
  templateUrl: './profile-block.component.html',
  styleUrls: ['./profile-block.component.scss'],
})
export class ProfileBlockComponent implements OnInit {

  @Input() profileId: string;
  @Input() collection: string;

  profile: UserProfile;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getProfile();
  }

  async getProfile() {
    const ref = await this.dataService.getSingleItem('profiles', this.profileId);
    this.profile = ref.data;
  }

}
