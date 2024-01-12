import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityPageRoutingModule } from './community-routing.module';

import { CommunityPage } from './community.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { EventWidgetsModule } from 'src/app/components/event-widgets/event-widgets.module';
import { SuggestionWidgetModule } from 'src/app/components/suggestion-widget/suggestion-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityPageRoutingModule,
    SharedModule,
    EventWidgetsModule,
    SuggestionWidgetModule
  ],
  declarations: [CommunityPage]
})
export class CommunityPageModule {}
