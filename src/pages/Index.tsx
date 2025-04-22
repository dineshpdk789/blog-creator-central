
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { fetchAllPosts } from '@/services/postService';

const Index = () => {
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts
  });
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to BloggerClone</h1>
        <p className="text-gray-600 text-lg">Discover the latest articles and insights</p>
      </div>
      
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blog-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading posts...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading posts. Please try again later.</p>
        </div>
      )}
      
      {!isLoading && posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts found. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Index;
