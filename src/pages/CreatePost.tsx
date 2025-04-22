
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PostForm from '@/components/PostForm';
import { addPost } from '@/data/posts';
import { checkAuth } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';

const CreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  useEffect(() => {
    const isAdmin = checkAuth();
    if (!isAdmin) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in as admin to create posts.",
        variant: "destructive",
      });
      navigate('/');
    } else {
      setIsAuthChecked(true);
    }
  }, [navigate, toast]);
  
  const handleSubmit = (data: {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    images: string[];
  }) => {
    try {
      const newPost = addPost(data);
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
      navigate(`/post/${newPost.slug}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating the post.",
        variant: "destructive",
      });
    }
  };
  
  if (!isAuthChecked) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Checking authentication...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
        <p className="text-gray-600 dark:text-gray-400">Write your thoughts and share them with the world</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <PostForm onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default CreatePost;
