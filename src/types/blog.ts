
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string; // Opcional - só existe se o status for 'published'
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  category: string;
  tags: string[];
  image: string;
  readTime: string;
  views: number;
  likes: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  status: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
}
