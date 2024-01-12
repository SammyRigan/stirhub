import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArchivesPageRoutingModule } from './archives-routing.module';

import { ArchivesPage } from './archives.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { SuggestionWidgetModule } from 'src/app/components/suggestion-widget/suggestion-widget.module';
import { CustomPipesModule } from 'src/app/pipes/custom-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArchivesPageRoutingModule,
    SharedModule,
    SuggestionWidgetModule,
    CustomPipesModule
  ],
  declarations: [ArchivesPage]
})
export class ArchivesPageModule {}
