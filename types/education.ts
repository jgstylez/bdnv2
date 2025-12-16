export interface Guide {
  id: string;
  title: string;
  description: string;
  category: "getting-started" | "features" | "merchant" | "payments" | "rewards" | "community";
  steps: GuideStep[];
  estimatedTime: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  icon: string;
  createdAt: string;
  updatedAt: string;
  learningObjectives?: string[]; // What users will learn
  prerequisites?: string[]; // What users should know before starting
}

export type InteractiveElementType = 
  | "checkbox" 
  | "button" 
  | "code-snippet" 
  | "highlight" 
  | "tooltip" 
  | "video" 
  | "image-annotation";

export interface InteractiveElement {
  type: InteractiveElementType;
  id: string;
  label?: string;
  content?: string;
  action?: {
    type: "navigate" | "open-modal" | "copy-code" | "highlight-element";
    target?: string;
  };
  checked?: boolean;
  required?: boolean;
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  description: string;
  detailedContent?: string; // Expanded content for the step
  imageUrl?: string;
  tips?: string[];
  interactiveElements?: InteractiveElement[];
  codeExample?: {
    language: string;
    code: string;
  };
  completionCriteria?: string; // What needs to be done to complete this step
  estimatedTime?: string; // Time for this specific step
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string; // e.g., "5:30"
  category: "tutorial" | "feature" | "tips" | "community" | "business";
  tags: string[];
  views: number;
  createdAt: string;
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: "account" | "payments" | "merchant" | "rewards" | "troubleshooting" | "faq";
  tags: string[];
  relatedArticles?: string[];
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

export type BlogContentBlock = 
  | { type: "paragraph"; content: string }
  | { type: "heading"; level: 1 | 2 | 3 | 4; content: string }
  | { type: "image"; url: string; alt?: string; caption?: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "code"; language: string; code: string }
  | { type: "quote"; content: string; author?: string }
  | { type: "divider" }
  | { type: "callout"; variant: "info" | "warning" | "success" | "error"; content: string };

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Plain text or markdown fallback
  contentBlocks?: BlogContentBlock[]; // Structured rich content
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: "news" | "tips" | "community" | "business" | "updates";
  featuredImage?: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readTime: number; // minutes
  views: number;
  relatedPosts?: string[]; // IDs of related posts
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

