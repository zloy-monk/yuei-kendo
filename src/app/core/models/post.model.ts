export interface PostTranslation {
  title: string;
  excerpt: string;
  content: string;
}

export interface Post {
  id: string;
  slug: string;
  publishedAt: string;
  author: string;
  coverImage?: string;
  translations: Record<string, PostTranslation>;
}
