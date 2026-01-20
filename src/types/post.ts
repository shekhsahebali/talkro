import { User } from "./user";


export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  options: PollOption[];
  totalVotes: number;
  endsAt: Date;
}

export interface Feeling {
  emoji: string;
  label: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
  likes: number;
  retweets: number;
  replies: number;
  views: string;
  image?: string; 
  images?: string[]; 
  gif?: string;
  isFavorite?: boolean;
  isEdited?: boolean;
  previousContent?: string;
  poll?: Poll;
  location?: string;
  feeling?: Feeling;
  taggedUsers?: User[];
  sharedPostId?: string; // Reference to a shared post
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export interface Story {
  id: string;
  user: User;
  hasUnseen: boolean;
  mediaUrl?: string;
  caption?: string;
  timestamp?: Date;
  textOverlays?: TextOverlay[];
  music?: { title: string; artist: string };
  privacy?: 'public' | 'friends' | 'private';
}