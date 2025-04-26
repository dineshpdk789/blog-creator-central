
import { getAllPosts, getPostBySlug, getPostById, addPost, updatePost, deletePost } from '@/data/posts';

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
  const posts = getAllPosts();
  const post = posts.find(p => p.id === id);
  
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

export async function updatePostById(id, postData) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  const updated = updatePost(id, postData);
  
  if (!updated) {
    throw new Error('Post not found');
  }
  
  return updated;
}

export async function removePost(id) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  const success = deletePost(id);
  
  if (!success) {
    throw new Error('Post not found');
  }
  
  return { success };
}
