export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
}

export interface Tweet {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  imageUrl?: string;
  topic?: string;
}

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  progress: number; // 0 to 100
  duration: number;
  error?: string;
}

export enum Tab {
  Trending = 'TRENDING',
  MyFeed = 'MY_FEED',
  Search = 'SEARCH'
}

export interface SummaryResult {
  text: string;
  audioBuffer?: AudioBuffer;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  image?: string;
}