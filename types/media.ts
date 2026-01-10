export interface VideoChannel {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  category: "entertainment" | "education" | "business" | "community" | "news";
  isSubscribed: boolean;
  subscriberCount: number;
  videoCount: number;
  createdAt: string;
}

export interface VideoContent {
  id: string;
  channelId: string;
  channelName: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  views: number;
  likes: number;
  publishedAt: string;
  isPremium: boolean;
  tags: string[];
}

export interface MediaChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "video" | "audio" | "podcast" | "live";
  subscriptionRequired: boolean;
  subscriptionPrice?: number;
  currency?: "USD" | "BLKD";
  contentCount: number;
  subscriberCount: number;
  isSubscribed: boolean;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: "news" | "features" | "community" | "business" | "updates";
  featuredImage?: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  views: number;
  isPublished: boolean;
}


export interface MediaContentItem {
  id: string;
  channelId: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  contentType: "video" | "audio" | "podcast" | "live";
  duration?: string;
  views: number;
  likes: number;
  publishedAt: string;
  isPremium: boolean;
  tags: string[];
}
