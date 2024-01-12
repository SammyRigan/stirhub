import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SinglePublicationsPageRoutingModule } from './single-publications-routing.module';

import { SinglePublicationsPage } from './single-publications.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { SuggestionWidgetModule } from 'src/app/components/suggestion-widget/suggestion-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SinglePublicationsPageRoutingModule,
    SharedModule,
    SuggestionWidgetModule
  ],
  declarations: [SinglePublicationsPage]
})
export class SinglePublicationsPageModule {}
