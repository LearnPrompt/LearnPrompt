export const Friends: Friend[] = [
  {
    title: 'guizang',
    description: 'Product Designer | AIGC Weekly Updated Every Monday',
    website: 'https://op7418.zhubai.love/',
    avatar: '/img/friend/guizang.png',
  },
  {
    title: 'baoyu',
    description: 'Prompt Engineer | Bilingual AIGC course',
    website: 'https://www.youtube.com/@baoyu_/videos',
    avatar: '/img/friend/baoyu.png',
  },
  {
    title: 'xiaohu',
    description: 'The fastest sharing of artificial intelligence news',
    website: 'https://twitter.com/imxiaohu',
    avatar: '/img/friend/xiaohu.png',
  },
  {
    title: 'waytoagi',
    description: 'Chinese open source AI knowledge base',
    website: 'https://waytoagi.com/',
    avatar: '/img/friend/way2agi.png',
  },
  {
    title: 'hardhacker',
    description: 'In-depth thinking of Internet entrepreneurs | Regular updates every Tuesday',
    website: 'https://hardhacker.com/',
    avatar: '/img/friend/hacker.png',
  },
  {
    title: 'Dify',
    description: 'Development platform for creating Assistant API and GPT',
    website: 'https://github.com/langgenius/dify',
    avatar: '/img/friend/dify.png',
  },
  {
    title: 'aicpb',
    description: 'AI Product List | Essential for AI Product Managers',
    website: 'https://aicpb.com/',
    avatar: '/img/friend/aicpb.png',
  }
]

export type Friend = {
  title: string
  description: string
  website: string
  avatar?: string
}
