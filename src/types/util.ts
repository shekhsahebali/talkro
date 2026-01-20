
import { User } from "./user";


export interface Notification {
  id: string;
  type: 'like' | 'repost' | 'follow' | 'mention';
  user: User;
  content?: string;
  timestamp: string;
}



export interface Trend {
  topic: string;
  category: string;
  posts: string;
}


