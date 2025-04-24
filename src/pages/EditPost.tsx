
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import PostForm from '@/components/PostForm';
import { fetchPostById, updatePost } from '@/services/postService';
import { Post } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => id ? fetchPostById(id) : null,
    enabled: !!id
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load post for editing.",
        variant: "destructive",
      });
      navigate('/admin');
    }
  }, [error, navigate, toast]);
  
  const handleSubmit = async (data: {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    images: string[];
    categories: string[];
  }) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedPost = await updatePost(id, {
        ...data,
        categories: data.categories || []
      });
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully.",
      });
      navigate(`/post/${updatedPost.slug}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem updating the post.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blog-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading post...</p>
        </div>
      </Layout>
    );
  }
  
  if (!post) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Post not found</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Post</h1>
        <p className="text-gray-600 dark:text-gray-400">Update your blog post content</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <PostForm post={post} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </Layout>
  );
};

export default EditPost;
