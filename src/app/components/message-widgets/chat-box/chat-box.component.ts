import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Chat, Thread } from 'src/app/models/models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit, OnDestroy {

  @Input() thread: Thread;
  @Input() receiver: any;
  @Input() sender: any;

  @Output() dropper: EventEmitter<boolean> = new EventEmitter();
  @Output() hider: EventEmitter<boolean> = new EventEmitter();

  show = true;

  message: Chat = {
    id: null,
    text: null,
    imgUrls: [],
    date: null,
    videoUrl: null,
    senderId: null,
    receiverId: null
  };

  messages: Chat[] = [];

  video: File;
  images: File[] = [];
  tempVidUrl: string;
  tempImgUrls: string[] = [];

  constructor(
    private generalService: GeneralService
  ) { }

  ngOnInit() {
    this.getMessages();
  }

  drop() {
    this.dropper.emit(true);
  }

  hide() {
    this.hider.emit(true);
    this.show = !this.show;
  }

  getMessages() {
    this.generalService.getMessages(`threads/${this.thread.id}/messages`).subscribe(res => {
      this.messages = res.map(e => ({
        id: e.payload.doc.id,
        ...e.payload.doc.data() as Chat
      }));
    });
    // document.getElementById('chats').scrollTo(0, ) = document.getElementById('chats').scrollHeight;
  }

  async sendMessage() {
    if (!this.message.text && !this.video && this.images.length === 0) {
      return;
    }
    this.message.receiverId = this.receiver.id;
    this.message.senderId = this.sender.id;
    this.message.date = Date.now().toString();
    this.thread.lastMsgDate = Date.now().toString();
    this.thread.messageCount = this.thread.messageCount + 1;
    this.thread.unreadCount = this.thread.unreadCount + 1;
    this.thread.lastMessage = {
      userId: this.sender.id,
      message: this.message.text,
      video: !!this.video,
      image: !!this.images.length
    };
    if (!this.thread.id) {
      this.thread.date = Date.now().toString();
      const threadRef = await this.generalService.addItem('threads', {...this.thread});
      this.thread.id = threadRef.id;
    } else {
      this.generalService.updateItem(`threads/${this.thread.id}`, {...this.thread});
    }
    this.messages.push({...this.message});
    this.generalService.addItem(`threads/${this.thread.id}/messages`, {...this.message});
    this.message = {
      id: null,
      text: null,
      imgUrls: [],
      date: null,
      videoUrl: null,
      senderId: null,
      receiverId: null
    };
  }

  ngOnDestroy() {}

}
