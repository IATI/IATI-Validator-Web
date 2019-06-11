import { MessageType } from './message-type.enum';
export interface Message {
  message: string;
  type: MessageType;
  progress: number;
  uploadId?: string;
}
