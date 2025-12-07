import { Tweet, Category } from './types';

export const TRENDING_TWEETS: Tweet[] = [
  {
    id: 't1',
    user: {
      id: 'u1',
      name: 'Elon Musk',
      handle: '@elonmusk',
      avatar: 'https://picsum.photos/seed/elon/100/100',
    },
    content: "SpaceX is targeting late next week for the 4th flight of Starship. The payload will be a Tesla Cybertruck playing 'Life on Mars' on repeat. Humanity needs to become multi-planetary to survive the great filter.",
    timestamp: '2h',
    likes: 452000,
    retweets: 54000,
    imageUrl: 'https://picsum.photos/seed/rocket/600/400',
    topic: 'Space',
  },
  {
    id: 't2',
    user: {
      id: 'u2',
      name: 'TechCrunch',
      handle: '@TechCrunch',
      avatar: 'https://picsum.photos/seed/tc/100/100',
    },
    content: "Apple just announced the new Vision Pro 2 features. It includes full body tracking without controllers and a 50% lighter headset design. The stock market is reacting positively with APPL up 3% in pre-market trading.",
    timestamp: '4h',
    likes: 12000,
    retweets: 3400,
    topic: 'Tech',
  },
  {
    id: 't4',
    user: {
      id: 'u4',
      name: 'OpenAI',
      handle: '@OpenAI',
      avatar: 'https://picsum.photos/seed/openai/100/100',
    },
    content: "Introducing Sora v2. Generative video is now real-time. You can direct scenes with your voice while the video plays. Available to all Plus users starting today.",
    timestamp: '30m',
    likes: 250000,
    retweets: 80000,
    imageUrl: 'https://picsum.photos/seed/video/600/400',
    topic: 'AI',
  }
];

export const MY_FEED_TWEETS: Tweet[] = [
  {
    id: 't3',
    user: {
      id: 'u3',
      name: 'Naval',
      handle: '@naval',
      avatar: 'https://picsum.photos/seed/naval/100/100',
    },
    content: "Wealth is assets that earn while you sleep. Money is how we transfer time and wealth. Status is your place in the social hierarchy. Ignore status, focus on wealth.",
    timestamp: '1d',
    likes: 89000,
    retweets: 21000,
    topic: 'Philosophy',
  },
   {
    id: 't5',
    user: {
      id: 'u5',
      name: 'MKBHD',
      handle: '@MKBHD',
      avatar: 'https://picsum.photos/seed/mkbhd/100/100',
    },
    content: "I've been using the new Pixel 10 for a week. The camera is genuinely better than the human eye in low light. Full review dropping tomorrow, but spoiler: the battery life is insane.",
    timestamp: '5h',
    likes: 45000,
    retweets: 1200,
    imageUrl: 'https://picsum.photos/seed/phone/600/400',
    topic: 'Tech',
  },
  {
    id: 't6',
    user: {
      id: 'u6',
      name: 'Paul Graham',
      handle: '@paulg',
      avatar: 'https://picsum.photos/seed/pg/100/100',
    },
    content: "The most successful startups are the ones that solve a problem the founders themselves have. If you aren't your own user, you're flying blind.",
    timestamp: '6h',
    likes: 12000,
    retweets: 3000,
    topic: 'Startups',
  }
];

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Technology', color: 'bg-blue-600' },
  { id: '2', name: 'Politics', color: 'bg-red-600' },
  { id: '3', name: 'Crypto', color: 'bg-yellow-600' },
  { id: '4', name: 'Sports', color: 'bg-green-600' },
  { id: '5', name: 'Entertainment', color: 'bg-purple-600' },
  { id: '6', name: 'Science', color: 'bg-indigo-600' },
  { id: '7', name: 'Business', color: 'bg-gray-600' },
  { id: '8', name: 'Art & Design', color: 'bg-pink-600' },
];

export const SYSTEM_PROMPT_SUMMARY = `
You are an expert editor for a "TikTok for Audio" app. 
Your goal is to summarize X (Twitter) posts into engaging, conversational scripts for Text-to-Speech.
Keep it under 30 words.
Make it sound like a news anchor or a podcaster giving a quick update.
Start directly with the core message.
`;