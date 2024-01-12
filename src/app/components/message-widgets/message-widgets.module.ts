import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ContactsBoxComponent } from './contacts-box/contacts-box.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { MessageMediaComponent } from './message-media/message-media.component';
import { ThreadCardComponent } from './thread-card/thread-card.component';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [MessageBoxComponent, ChatBoxComponent, ContactsBoxComponent,ThreadCardComponent, MessageMediaComponent],
  exports: [MessageBoxComponent, ChatBoxComponent, ContactsBoxComponent,ThreadCardComponent, MessageMediaComponent]
})
export class MessageWidgetsModule {}
