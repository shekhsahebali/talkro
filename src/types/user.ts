export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  cover?: string;
  bio?: string;
  location?: string;
  website?: string;
  joined?: string;
  verified?: boolean;
  following?: number;
  followers?: number | string;
  work?: string;
  education?: string;
  isOnline?: boolean;
  // Creator fields
  isCreator?: boolean;
  creatorStatus?: 'eligible' | 'applying' | 'pending' | 'active' | 'rejected';
  monetizationEnabled?: boolean;
  subscriptionPrice?: number;
  creatorCategory?: string;
  creatorStats?: {
    totalViews: number;
    engagementRate: number;
    monthlyEarnings: number;
    totalEarnings: number;
    pendingPayout: number;
    profileVisits: number;
    linkClicks: number;
  };
}