import { User } from "./user";
import { Post } from "./post";



export interface ChatState {
  userId: string;
  isMinimized: boolean;
}

export interface Attachment {
  url: string;
  type: 'image' | 'file';
  name: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  sharedPost?: Post; 
  attachment?: Attachment;
}

export interface Conversation {
  id: string;
  participant?: User; 
  participants?: User[]; 
  name?: string; 
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
  isGroup?: boolean;
  themeColor?: string;
  customEmoji?: string;
  nicknames?: Record<string, string>;
}

export interface Comment {
  id: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  author: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  replies?: Comment[];
}