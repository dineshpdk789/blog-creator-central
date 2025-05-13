
import { supabase } from "@/integrations/supabase/client";
import { FilterParams, PaginationParams, Post, PostsResponse, ApiError } from "@/types/blog";
import { PostgrestError } from "@supabase/supabase-js";

// Helper function to handle Supabase errors
const handleSupabaseError = (error: PostgrestError | null, notFoundMessage?: string): never => {
  if (!error) return;
  
  console.error('Supabase error:', error);
  
  // Handle specific error codes
  if (error.code === 'PGRST116') {
    throw ApiError.notFound(notFoundMessage || 'Resource not found');
  }
  
  if (error.code === '42501' || error.code === '42P01') {
    throw ApiError.unauthorized('You don\'t have permission to access this resource');
  }
  
  if (error.code?.startsWith('23')) {
    throw ApiError.badRequest(error.message);
  }
  
  throw new ApiError(error.message, 500, error.code || 'database_error');
};

// Get all posts with pagination and filtering
export const fetchAllPosts = async (
  pagination: PaginationParams = {},
  filters: FilterParams = {}
): Promise<PostsResponse> => {
  try {
    const { page = 1, pageSize = 10 } = pagination;
    const { category, search, status, sortBy = 'created_at', sortOrder = 'desc' } = filters;
    
    // Start building the query
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (category) {
      query = query.contains('categories', [category]);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }
    
    if (status) {
      query = query.eq('status', status);
    } else {
      // Default to showing only published posts for non-admins
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        query = query.eq('status', 'published');
      }
    }
    
    // Calculate pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Apply sorting and pagination
    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);
    
    if (error) {
      handleSupabaseError(error);
    }
    
    return {
      data: data as Post[],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error fetching posts:', error);
    throw new ApiError('Failed to fetch posts', 500);
  }
};

// Get a single post by slug
export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      handleSupabaseError(error);
    }
    
    return data as Post;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error fetching post by slug:', error);
    throw new ApiError(`Failed to fetch post with slug: ${slug}`, 500);
  }
};

// Get a single post by ID
export const fetchPostById = async (id: string): Promise<Post | null> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      handleSupabaseError(error);
    }
    
    return data as Post;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error fetching post by id:', error);
    throw new ApiError(`Failed to fetch post with id: ${id}`, 500);
  }
};

// Create a new post
export const createPost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Post> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw ApiError.unauthorized('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('posts')
      .insert({
        ...post,
        categories: post.categories || [],
        images: post.images || [],
        status: post.status || 'draft', // Default to draft if not specified
        user_id: userData.user.id
      })
      .select()
      .single();
      
    if (error) {
      handleSupabaseError(error);
    }
    
    return data as Post;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error creating post:', error);
    throw new ApiError('Failed to create post', 500);
  }
};

// Update an existing post
export const updatePost = async (id: string, updates: Partial<Post>): Promise<Post> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update({
        ...updates,
        categories: updates.categories || undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      handleSupabaseError(error, `Post with ID ${id} not found`);
    }
    
    return data as Post;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error updating post:', error);
    throw new ApiError(`Failed to update post with id: ${id}`, 500);
  }
};

// Delete a post
export const deletePost = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
      
    if (error) {
      handleSupabaseError(error, `Post with ID ${id} not found`);
    }
    
    return true;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error deleting post:', error);
    throw new ApiError(`Failed to delete post with id: ${id}`, 500);
  }
};

// Upload an image with optimization
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Check file type and size
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      throw ApiError.badRequest('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.');
    }
    
    // 5MB max size
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw ApiError.badRequest('File too large. Maximum size is 5MB.');
    }
    
    // TODO: Add image optimization with canvas before upload
    // For now, we'll just upload the original file
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = fileName;
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('blog_images')
      .upload(filePath, file);
      
    if (error) {
      console.error('Storage error:', error);
      throw new ApiError('Failed to upload image', 500);
    }
    
    // Get public URL
    const { data } = supabase.storage
      .from('blog_images')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error uploading image:', error);
    throw new ApiError('Failed to upload image', 500);
  }
};

// Change post status
export const changePostStatus = async (id: string, status: 'draft' | 'published' | 'archived'): Promise<Post> => {
  return updatePost(id, { status });
};
