/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Person, Research, Sponsor, UserProfile } from 'src/app/models/models';
import { GeneralService } from 'src/app/services/general.service';
import { AddPersonComponent } from '../add-person/add-person.component';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss'],
})
export class ResearchComponent implements OnInit {

  @Input() poster: {
    id: string;
    type: string;
    imgUrl: string;
  }; // INFO ON CURRENTLY LOGGED IN USER
  @Input() profile: UserProfile;

  tempUri = null;
  resImg: File = null;

  research: Research = {
    _id: null,
    date: null,
    title: null,
    brief: null,
    lead: null,
    team: [],
    imageUrl: null,
    fileUrl: null,
    categoryId: null,
    sponsors: [],
    teamIds: [],
    sponsorIds: [],
    addedBy: null
  };

  oldTeam = [];

  file: File;

  constructor(
    // private activatedRoute: ActivatedRoute,
    // private researchService: ResearchService,
    // private databaseService: DatabasePortalService,
    private generalService: GeneralService,
    private dataService: DataService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.getPoster();
  }

  close() {
    this.modalCtrl.dismiss();
  }


  async getPoster() {
    const url = `${this.poster.type === 'user-profile' || this.poster.type === 'person' ? 'user-profiles' : 'institutions'}/${this.poster.id}`;
    const proRef = await this.generalService.getSingleItem(url);
    this.profile = {
      id: proRef.id,
      ...proRef.data() as any
    };
    // if (this.profile.adminId) {
    //   this.research.sponsorIds.push(this.profile.id);
    //   this.research.sponsors.push({
    //     instId: this.profile.id,
    //     name: this.profile.name,
    //     email: this.profile.email,
    //     imgUrl: this.profile.imgUrl ? this.profile.imgUrl : null
    //   });
    // } else {
    //   this.research.lead = {
    //     imageUrl: this.profile.imgUrl ? this.profile.imgUrl : null,
    //     fullName: this.profile.firstname + ' ' + this.profile.lastname,
    //     userId: this.profile.id,
    //     email: this.profile.email
    //   };
    // }
    this.research.teamIds.push(this.profile._id);
  }

  // async getResearch(id: string) {
  //   const reseachRef = await this.generalService.getSingleItem('researches', id);
  //   this.research = {
  //     id: reseachRef.id,
  //     ...reseachRef.data() as Research
  //   };
  //   const teams = {...this.research}.teamIds;
  //   this.oldTeam = this.oldTeam.concat(teams);
  // }

  async addLead() {
    const modal = await this.modalCtrl.create({
      component: AddPersonComponent,
      // cssClass: ['auto-height'],
      componentProps: {
        type: 'research lead'
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.research.lead = data;
      if (data.userId) {
        this.research.teamIds.push(data.userId);
      }
    }
  }

  async addTeamMember() {
    const modal = await this.modalCtrl.create({
      component: AddPersonComponent,
      componentProps: {
        type: 'team member'
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.research.team.push(data);
      if (data.userId) {
        this.research.teamIds.push(data.userId);
      }
    }
  }

  removeLead() {
    this.research.lead = null;
    if (this.research.lead.userId) {
      this.research.teamIds = this.research.teamIds.filter(i => i !== this.research.lead.userId);
    }
  }

  removeTeamMember(member: Person) {
    this.research.team = this.research.team.filter(a => a !== member);
    if (member.userId) {
      this.research.teamIds = this.research.teamIds.filter(i => i !== member.userId);
    }
  }

  async addSponsor() {
    const modal = await this.modalCtrl.create({
      component: AddPersonComponent,
      componentProps: {
        type: 'sponsor'
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.research.sponsors.push(data);
      if (data.userProId) {
        this.research.teamIds.push(data.userProId);
      }
      if (data.instId) {
        this.research.teamIds.push(data.instId);
      }
    }
  }

  removeSponsor(sponsor: Sponsor) {
    this.research.sponsors = this.research.sponsors.filter(a => a !== sponsor);
    if (sponsor.userProId) {
      this.research.teamIds = this.research.teamIds.filter(i => i !== sponsor.userProId);
    }
    if (sponsor.instId) {
      this.research.teamIds = this.research.teamIds.filter(i => i !== sponsor.instId);
    }
  }

  chooseCategory(id: string) {
    this.research.categoryId = id;
  }

  async addMedia() {
    // const modal = await this.modalCtrl.create({
    //   component: MediaPage,
    //   cssClass: 'md-wrap',
    //   componentProps: {
    //     asSelector: true
    //   }
    // });
    // await modal.present();
    // const { data } = await modal.onWillDismiss();
    // if (data) {
    //   this.research.imageUrl = data.mediaUrl;
    // }
  }

  uploadMedia(event) {
    this.file = event.target.files[0];
    // console.log(this.file);
  }

  async createResearch() {
    if (!this.research.title || !this.research.brief || !this.resImg) {
      return;
    }
    const loading = await this.loadingCtrl.create();
    await loading.present();
    if (this.resImg) {
      const url = await this.upload(this.resImg);
      this.research.imageUrl = url;
    }
    if (!this.research._id) {
      this.research.addedBy = this.profile._id;
      // Create a root reference
      const storage = getStorage();

      // Create a reference to 'mountains.jpg'
      // const storageRef = ref(, 'some-child');
      const storageRef = ref(storage, Date.now().toString() + `${this.file.name}`);

      const snapshot = await uploadBytes(storageRef, this.file);
      const downloadUrl = await getDownloadURL(storageRef);
      this.research.fileUrl = downloadUrl;
      this.research.date = Date.now().toString();
      await this.dataService.addItem(this.research, 'researches');
    } else {
      if (this.file && !this.research.fileUrl) {
        // Create a root reference
        const storage = getStorage();

        // Create a reference to 'mountains.jpg'
        // const storageRef = ref(, 'some-child');
        const storageRef = ref(storage, Date.now().toString() + `${this.file.name}`);

        const snapshot = await uploadBytes(storageRef, this.file);
        const downloadUrl = await getDownloadURL(storageRef);
        this.research.fileUrl = downloadUrl;
      }
      this.dataService.updateItem('researches', this.research);
    }
    await this.modalCtrl.dismiss(this.research);
    await loading.dismiss();
    // if (this.profile || this.institution) {
    // }
  }

  readFile(event) {
    // if (this.tempUri) {
      console.log(event.target.files);
      this.resImg = event.target.files[0];
      // const reader = new FileReader();
      this.tempUri = URL.createObjectURL(event.target.files[0]);
      // this.tempUri.push(url);
      console.log(this.tempUri);
    // }
    event.target.value = '';
  }

  async upload(file: File) {
    // Create a root reference
    const storage = getStorage();

    // Create a reference to 'mountains.jpg'
    // const storageRef = ref(, 'some-child');
    const storageRef = ref(storage, Date.now().toString() + `${file.name}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  }

}
