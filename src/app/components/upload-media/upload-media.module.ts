import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UploadMediaComponent } from './upload-media.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [UploadMediaComponent],
  exports: [UploadMediaComponent]
})
export class UploadMediaModule {}
