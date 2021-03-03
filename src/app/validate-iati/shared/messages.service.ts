import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './message';


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
