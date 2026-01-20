export interface CommunityRule {
  id: string;
  title: string;
  description: string;
}

export type CommunityRole = 'admin' | 'moderator' | 'member';

export interface Community {
  id: string;
  name: string;
  handle: string;
  description: string;
  memberCount: string;
  avatar: string;
  cover: string;
  isJoined?: boolean;
  userRole?: CommunityRole;
  rules?: CommunityRule[];
  topics?: string[];
  pinnedPostId?: string;
  privacyType?: 'public' | 'restricted' | 'private';
  requirePostApproval?: boolean;
  memberVisibility?: boolean;
}