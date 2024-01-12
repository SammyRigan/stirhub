import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventBlockComponent } from './event-block/event-block.component';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  declarations: [
    EventBlockComponent,
    CreateEventComponent
  ],
  exports: [
    EventBlockComponent,
    CreateEventComponent
  ]
})
export class EventWidgetsModule {}
