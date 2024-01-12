import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimelinePageRoutingModule } from './timeline-routing.module';

import { TimelinePage } from './timeline.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { SuggestionWidgetModule } from 'src/app/components/suggestion-widget/suggestion-widget.module';
import { EventWidgetsModule } from 'src/app/components/event-widgets/event-widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimelinePageRoutingModule,
    SharedModule,
    SuggestionWidgetModule,
    EventWidgetsModule
  ],
  declarations: [TimelinePage]
})
export class TimelinePageModule {}
