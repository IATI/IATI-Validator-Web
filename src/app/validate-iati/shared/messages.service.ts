import { Injectable } from '@angular/core';

import { Message } from './message';
import { MessageType } from './message-type.enum';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessagesService {
  messages = new Subject<Message[]>();
  messagesLocal: Message[] = [];

  constructor() { }

  add(message: Message) {
    this.messagesLocal.push(message);
    this.messages.next(this.messagesLocal.slice());
  }

  clear() {
    this.messagesLocal = [];
    this.messages.next(this.messagesLocal.slice());
  }

}
