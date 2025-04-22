
import { supabase } from "@/integrations/supabase/client";
import { Post } from "@/types/blog";

// Get all posts
export const fetchAllPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error(error.message);
  }

  return data as Post[];
};

// Get post by slug
export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    // If error is 'No rows matched', return null
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching post:', error);
    throw new Error(error.message);
  }

  return data as Post;
};

// Get post by ID
export const fetchPostById = async (id: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    // If error is 'No rows matched', return null
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching post:', error);
    throw new Error(error.message);
  }

  return data as Post;
};

// Create a new post
export const createPost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Post> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('posts')
    .insert({
      ...post,
      user_id: userData.user.id
    } as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw new Error(error.message);
  }

  return data as Post;
};

// Update an existing post
export const updatePost = async (id: string, updates: Partial<Post>): Promise<Post> => {
  const { data, error } = await supabase
    .from('posts')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    } as any)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    throw new Error(error.message);
  }

  return data as Post;
};

// Delete a post
export const deletePost = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    throw new Error(error.message);
  }

  return true;
};

// Upload an image to Supabase Storage
export const uploadImage = async (file: File): Promise<string> => {
  // Generate a unique file name based on timestamp and original name
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('blog_images')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error(error.message);
  }

  // Get public URL
  const { data } = supabase.storage
    .from('blog_images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
