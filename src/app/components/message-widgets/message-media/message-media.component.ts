import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-message-media',
  templateUrl: './message-media.component.html',
  styleUrls: ['./message-media.component.scss'],
})
export class MessageMediaComponent implements OnInit {
  @ViewChild('slider') slider: IonSlides;
  @Input() imgUrls: string[];

  activeIndex: number;
  slideOpts = {
    initialSlide: 2
  };

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit(
  ) {}


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

}
