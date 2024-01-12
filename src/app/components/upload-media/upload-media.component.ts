import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-upload-media',
  templateUrl: './upload-media.component.html',
  styleUrls: ['./upload-media.component.scss'],
})
export class UploadMediaComponent implements OnInit {

  @Input() file: File;
  @Input() elem: HTMLElement;
  @Output() done: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.upload();
  }

  async upload() {
    // Create a root reference
    const storage = getStorage();

    // Create a reference to 'mountains.jpg'
    // const storageRef = ref(, 'some-child');
    const storageRef = ref(storage, Date.now().toString() + `${this.file.name}`);

    const snapshot = await uploadBytes(storageRef, this.file);
    const downloadUrl = await getDownloadURL(storageRef);
    // const media: Media = {
    //   _id: null,
    //   fileName: this.file.name,
    //   fileType: this.file.type,
    //   date: Date.now().toString(),
    //   mediaUrl: downloadUrl
    // };
    // this.medaiService.addMediaFile(media);
    this.done.emit(downloadUrl);
  }

}
