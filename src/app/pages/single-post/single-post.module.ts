import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SinglePostPageRoutingModule } from './single-post-routing.module';

import { SinglePostPage } from './single-post.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { SuggestionWidgetModule } from 'src/app/components/suggestion-widget/suggestion-widget.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SinglePostPageRoutingModule,
    RouterModule,
    SharedModule,
    SuggestionWidgetModule
  ],
  declarations: [SinglePostPage]
})
export class SinglePostPageModule {}
