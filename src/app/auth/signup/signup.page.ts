import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  invitation = null;
  profile: UserProfile = {
    _id: null,
    date: null,
    userId: null,
    iType: null,
    email: null,
    address: {
      address: null,
      lat: null,
      lng: null
    },
    followers: [],
    following: [],
    likedBy: [],
    liked: [],
    observedBy: [],
    observing: [],
    researchCount: 0,
    publicationCount: 0,
    educationHistory: [],
    workHistory: [],
    bannerUrl: null,
    knownFor: null,
    studyField: null,
    briefBio: null,
    firstname: null,
    lastname: null,
    name: null,
    username: null,
    telephone: null,
    gpsAddress: null,
    birthday: null,
    gender: null,
    title: null,
    interests: [],
    invites: 5,
    invitesSent: 0,
    invitesSignedUp: 0
  };

  inviter: UserProfile;

  password = null;
  passType = 'password';

  constructor(
    private authService: AuthService,
    private generalService: GeneralService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    const invitationId = this.activatedRoute.snapshot.params.pid;
    if (invitationId) {
      this.getInvitation(invitationId);
    }
  }

  async getInvitation(id: string) {
    const res = await this.generalService.getSingleItem(`invitations/${id}`);
    this.invitation = {
      id: res.id,
      ...res.data() as any
    };
    if (!res.exists) {
      this.router.navigateByUrl('/auth');
      return;
    }
    this.profile.email = this.invitation.email;
    this.getInviterProfile(this.invitation.profileId);
  }

  async getInviterProfile(id: string) {
    const res = await this.dataService.getSingleItem('profiles', id);
    this.inviter = res.data;
  }

  async signup() {
    if (!this.profile.email || !this.password || !this.profile.iType || !this.profile.knownFor) {
      return;
    }
    const loading = await this.loadingCtrl.create();
    await loading.present();
    this.profile.date = Date.now().toString();
    const res = await this.authService.signUp(this.profile.email, this.password);
    this.profile.userId = res.user.uid;
    const inviteeRes = await this.dataService.addItem(this.profile, 'profiles');
    if (this.invitation) {
      this.invitation.inviteeId = inviteeRes.dataId;
      this.invitation.onboard = true;
      await this.generalService.updateItem(`invitations/${this.invitation.id}`, this.invitation);
      this.inviter.invitesSignedUp = this.inviter.invitesSignedUp + 1;
      this.dataService.updateItem('profiles', this.inviter);
    }
    this.router.navigateByUrl('/');
    loading.dismiss();
  }

}
