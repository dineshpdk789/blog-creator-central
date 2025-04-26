
import { getAllPosts, getPostBySlug, getPostById, addPost, updatePost as updatePostFromData, deletePost as deletePostFromData } from '@/data/posts';

// Mock API functions to fetch posts
export async function fetchAllPosts() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return getAllPosts();
}

export async function fetchPostBySlug(slug) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const post = getPostBySlug(slug);
  if (!post) {
    throw new Error('Post not found');
  }
  return post;
}

export async function fetchPostById(id) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const post = getPostById(id);
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  return post;
}

export async function createPost(postData) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return addPost(postData);
}

export async function updatePost(id, postData) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  const updated = updatePostFromData(id, postData);
  
  if (!updated) {
    throw new Error('Post not found');
  }
  
  return updated;
}

export async function deletePost(id) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  const success = deletePostFromData(id);
  
  if (!success) {
    throw new Error('Post not found');
  }
  
  return { success };
}

// Add the missing uploadImage function
export async function uploadImage(file) {
  // Simulate network delay for file upload
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create a mock URL for the uploaded image
  // In a real implementation, this would handle the actual file upload
  // and return the URL from a cloud storage service
  return URL.createObjectURL(file);
}
