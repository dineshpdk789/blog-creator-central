
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PostForm from '@/components/PostForm';
import { createPost } from '@/services/postService';
import { useToast } from '@/hooks/use-toast';

const CreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    images: string[];
  }) => {
    setIsSubmitting(true);
    
    try {
      const newPost = await createPost(data);
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
      navigate(`/post/${newPost.slug}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem creating the post.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
        <p className="text-gray-600 dark:text-gray-400">Write your thoughts and share them with the world</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </Layout>
  );
};

export default CreatePost;
