import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { ProfileBuilderWidgetsModule } from 'src/app/components/profile-builder-widgets/profile-builder-widgets.module';
import { EditProfileModule } from 'src/app/components/edit-profile/edit-profile.module';
import { SuggestionWidgetModule } from 'src/app/components/suggestion-widget/suggestion-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedModule,
    ProfileBuilderWidgetsModule,
    EditProfileModule,
    SuggestionWidgetModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
