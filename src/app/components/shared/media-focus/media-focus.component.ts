import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { TimePost } from 'src/app/models/models';
import { GeneralService } from 'src/app/services/general.service';
import { PosterComponent } from '../poster/poster.component';

@Component({
  selector: 'app-media-focus',
  templateUrl: './media-focus.component.html',
  styleUrls: ['./media-focus.component.scss'],
})
export class MediaFocusComponent implements OnInit, AfterViewInit {

  @ViewChild('slider') slider: IonSlides;

  @Input() timePost: TimePost;
  @Input() selectedImg: number;
  @Input() doc: {
    id: string;
    type: string;
    imgUrl: string;
  };
  @Input() profile: any;
  @Input() postOwner: any;

  isLiked = false;

  slideOpts = {
    initialSlide: 2
  };

  activeIndex: number;
  comments: TimePost[] = [];
  lastComment: any = null;
  empty: boolean;

  constructor(
    private modalCtrl: ModalController,
    private generalService: GeneralService
  ) { }

  ngOnInit() {
    this.slideOpts.initialSlide = this.selectedImg;
    this.checkIfLiked();
    this.getComments();
  }

  ngAfterViewInit() {
    this.getActiveSlide();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  getActiveSlide() {
    this.slider.getActiveIndex().then(index => {
      this.activeIndex = index;
      console.log(this.activeIndex);
    });
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
        postOwner: this.postOwner,
        poster: this.doc
      }
    });
    await modal.present();
  }

  async viewMedia(selectedImg: number) {
    const modal = await this.modalCtrl.create({
      component: MediaFocusComponent,
      cssClass: ['bg-wrap', 'trans'],
      componentProps: {
        timePost: this.timePost,
        selectedImg
      }
    });
    await modal.present();
  }

  async getComments() {
    const postsRef = await this.generalService.getPosts('timeline', this.lastComment, null, this.timePost.id, 20);
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
    console.log(this.comments, this.timePost.id);
  }

}
