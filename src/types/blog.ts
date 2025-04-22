
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  images: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
