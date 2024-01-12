import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UploadMediaModule } from '../upload-media/upload-media.module';
import { EditProfileComponent } from './edit-profile.component';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, UploadMediaModule],
  declarations: [EditProfileComponent],
  exports: [EditProfileComponent]
})
export class EditProfileModule {}
