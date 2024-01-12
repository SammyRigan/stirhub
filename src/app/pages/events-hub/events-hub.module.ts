import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsHubPageRoutingModule } from './events-hub-routing.module';

import { EventsHubPage } from './events-hub.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { SuggestionWidgetModule } from 'src/app/components/suggestion-widget/suggestion-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsHubPageRoutingModule,
    SharedModule,
    SuggestionWidgetModule
  ],
  declarations: [EventsHubPage]
})
export class EventsHubPageModule {}
