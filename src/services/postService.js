
import { supabase } from "@/integrations/supabase/client";

// Fetch all posts
export async function fetchAllPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function fetchPostBySlug(slug) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Post not found');
    }
    throw new Error(error.message);
  }

  return data;
}

export async function fetchPostById(id) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Post not found');
    }
    throw new Error(error.message);
  }

  return data;
}

export async function createPost(postData) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('posts')
    .insert({
      ...postData,
      categories: postData.categories || [],
      user_id: userData.user.id
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updatePost(id, postData) {
  const { data, error } = await supabase
    .from('posts')
    .update({
      ...postData,
      categories: postData.categories || [],
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deletePost(id) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function uploadImage(file) {
  // Generate a unique file name based on timestamp and original name
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('blog_images')
    .upload(filePath, file);

  if (error) {
    throw new Error(error.message);
  }

  // Get public URL
  const { data } = supabase.storage
    .from('blog_images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
