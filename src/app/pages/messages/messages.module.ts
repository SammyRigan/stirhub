import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagesPageRoutingModule } from './messages-routing.module';

import { MessagesPage } from './messages.page';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { MessageWidgetsModule } from 'src/app/components/message-widgets/message-widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessagesPageRoutingModule,
    SharedModule,
    MessageWidgetsModule
  ],
  declarations: [MessagesPage]
})
export class MessagesPageModule {}
