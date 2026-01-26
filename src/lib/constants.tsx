
import React from 'react';

export const TRENDING_HASHTAGS = [
  'ReactJS', 'NextJS', 'TailwindCSS', 'WebDev', 'JavaScript', 'TypeScript', 
  'AI', 'Gemini', 'OpenAI', 'Programming', 'Coding', 'Frontend', 'Design', 
  'UIUX', 'TechNews', 'SoftwareEngineering', 'NexusHub'
];



export const CURRENT_USER = {
  id: 'u1',
  name: 'Senior Dev',
  handle: 'front_end_pro',
  avatar: 'https://picsum.photos/seed/user123/200',
  cover: 'https://picsum.photos/seed/cover123/1200/400',
  bio: 'Building the future of the web, one component at a time. Tech lead, runner, and coffee enthusiast.',
  location: 'San Francisco, CA',
  website: 'frontendpro.dev',
  joined: 'Joined March 2012',
  work: 'Senior Engineer at MetaX',
  education: 'Stanford University',
  verified: true,
  following: 842,
  followers: '12.4K',
  isCreator: false,
  monetizationEnabled: false,
  creatorStats: {
    totalViews: 4200000,
    engagementRate: 5.8,
    monthlyEarnings: 0,
    totalEarnings: 0,
    pendingPayout: 0
  }
};

export const MOCK_USERS = Array.from({ length: 15 }).map((_, i) => ({
  id: `u-list-${i}`,
  name: `User ${i + 1}`,
  handle: `user_handle_${i + 1}`,
  avatar: `https://picsum.photos/seed/listuser${i}/200`,
  bio: `Software Engineer and enthusiast. Building cool things on the web.`,
  verified: i % 3 === 0,
  isFollowing: i % 2 === 0,
}));

export const COMMUNITIES_MOCK = [
  {
    id: 'g1',
    name: 'React Developers',
    handle: 'react_devs',
    description: 'A global community for sharing React tips, tricks and job opportunities.',
    memberCount: '124K',
    avatar: 'https://picsum.photos/seed/react/200',
    cover: 'https://picsum.photos/seed/reactcover/800/300',
    isJoined: true,
  },
  {
    id: 'g2',
    name: 'AI Researchers',
    handle: 'ai_research',
    description: 'The place to discuss LLMs, Diffusers, and the future of Artificial General Intelligence.',
    memberCount: '89K',
    avatar: 'https://picsum.photos/seed/ai/200',
    cover: 'https://picsum.photos/seed/aicover/800/300',
  },
  {
    id: 'g3',
    name: 'UI/UX Designers',
    handle: 'design_system',
    description: 'Exploring modern design systems and user experience patterns.',
    memberCount: '56K',
    avatar: 'https://picsum.photos/seed/designc/200',
    cover: 'https://picsum.photos/seed/designcover/800/300',
  }
];

export const EXPLORE_TRENDS_MOCK = [
  { topic: 'Claude 4', category: 'Technology · Trending', posts: '224K posts' },
  { topic: '#NextJS', category: 'Web Dev · Trending', posts: '45.2K posts' },
  { topic: 'The Last of Us S2', category: 'Entertainment · Trending', posts: '1.2M posts' },
  { topic: 'Boca Juniors', category: 'Sports · Trending', posts: '12K posts' },
  { topic: '#TailwindCSS', category: 'Coding · Trending', posts: '8.4K posts' },
];

export const CONVERSATIONS_MOCK = [
  {
    id: 'c1',
    participant: {
      id: 'u2',
      name: 'Gemini AI',
      handle: '@GoogleGemini',
      avatar: 'https://picsum.photos/seed/gemini/200',
      verified: true,
    },
    lastMessage: 'Did you see the new multimodal updates?',
    timestamp: '2m',
    unread: true,
  },
  {
    id: 'c2',
    participant: {
      id: 'u10',
      name: 'Cinematic AI',
      handle: '@cine_ai',
      avatar: 'https://picsum.photos/seed/cine/200',
      verified: true,
    },
    lastMessage: 'That render was incredible!',
    timestamp: '1h',
  }
];

export const NOTIFICATIONS_MOCK = [
  {
    id: 'n1',
    type: 'like',
    user: { name: 'Alice', handle: '@alice', avatar: 'https://picsum.photos/seed/alice/200' },
    content: 'liked your post',
    timestamp: '5m',
  },
  {
    id: 'n2',
    type: 'follow',
    user: { name: 'Bob Smith', handle: '@bob', avatar: 'https://picsum.photos/seed/bob/200', verified: true },
    content: 'followed you',
    timestamp: '2h',
  }
];



export const STORY_DATA = [
  { id: 's1', user: { id: 'u1', name: 'Your Story', handle: '@front_end_pro', avatar: 'https://picsum.photos/seed/user123/200' }, hasUnseen: false },
  { id: 's2', user: { id: 'u2', name: 'Gemini', handle: '@gemini', avatar: 'https://picsum.photos/seed/gemini/200' }, hasUnseen: true },
];

export const INITIAL_POSTS = [
  {
    id: 'p1',
    author: {
      id: 'u2',
      name: 'Gemini AI',
      handle: '@GoogleGemini',
      avatar: 'https://picsum.photos/seed/gemini/200',
      verified: true,
    },
    content: "I'm integrated into this clone! Ask me anything about real-time trends using the Grok panel on the right. 🚀✨ #AI #Gemini #TechNews",
    timestamp: new Date(),
    likes: 1240,
    retweets: 450,
    replies: 89,
    views: '124K',
    image: 'https://picsum.photos/seed/ai-visual/1200/800',
  }, 
  {
    id: 'p2',
    author: {
      id: 'u2',
      name: 'Gemini AI 2',
      handle: '@GoogleGemini',
      avatar: 'https://picsum.photos/seed/gemini/200',
      verified: true,
    },
    content: "I'm integrated into this clone! Ask me anything about real-time trends using the Grok panel on the right. 🚀✨ #AI #Gemini #TechNews",
    timestamp: new Date(),
    likes: 1240,
    retweets: 450,
    replies: 89,
    views: '124K',
    image: 'https://picsum.photos/seed/ai-visual/1200/800',
  }
];
