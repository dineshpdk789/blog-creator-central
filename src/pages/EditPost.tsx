
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PostForm from '@/components/PostForm';
import { getPostBySlug, updatePost, getAllPosts } from '@/data/posts';
import { checkAuth } from '@/utils/auth';
import { Post } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  
  useEffect(() => {
    const isAdmin = checkAuth();
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    if (!id) {
      navigate('/admin');
      return;
    }
    
    const posts = getAllPosts();
    const foundPost = posts.find(post => post.id === id);
    
    if (foundPost) {
      setPost(foundPost);
    } else {
      navigate('/admin');
    }
  }, [id, navigate]);
  
  const handleSubmit = (data: {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    images: string[];
  }) => {
    try {
      if (id) {
        const updatedPost = updatePost(id, data);
        if (updatedPost) {
          toast({
            title: "Post updated",
            description: "Your post has been updated successfully.",
          });
          navigate(`/post/${updatedPost.slug}`);
        } else {
          throw new Error("Failed to update post");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating the post.",
        variant: "destructive",
      });
    }
  };
  
  if (!post) return null;
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Post</h1>
        <p className="text-gray-600">Update your blog post content</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <PostForm post={post} onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default EditPost;
