import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoticeBoardPageRoutingModule } from './notice-board-routing.module';

import { NoticeBoardPage } from './notice-board.page';
import { SuggestionWidgetModule } from 'src/app/components/suggestion-widget/suggestion-widget.module';
import { SharedModule } from 'src/app/components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoticeBoardPageRoutingModule,
    SuggestionWidgetModule,
    SharedModule
  ],
  declarations: [NoticeBoardPage]
})
export class NoticeBoardPageModule {}
