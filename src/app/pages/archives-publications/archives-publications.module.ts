import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArchivesPublicationsPageRoutingModule } from './archives-publications-routing.module';

import { ArchivesPublicationsPage } from './archives-publications.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { SuggestionWidgetModule } from 'src/app/components/suggestion-widget/suggestion-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArchivesPublicationsPageRoutingModule,
    SharedModule,
    SuggestionWidgetModule
  ],
  declarations: [ArchivesPublicationsPage]
})
export class ArchivesPublicationsPageModule {}
