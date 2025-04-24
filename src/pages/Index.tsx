
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { fetchAllPosts } from '@/services/postService';

const Index = () => {
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts
  });

  // Search
  const [search, setSearch] = useState("");
  const filteredPosts = useMemo(() => {
    if (!search) return posts;
    const s = search.toLowerCase();
    return posts.filter(post =>
      post.title?.toLowerCase().includes(s) || 
      post.excerpt?.toLowerCase().includes(s) || 
      post.content?.toLowerCase().includes(s) ||
      // Add category search
      post.categories?.some(category => 
        category.toLowerCase().includes(s)
      )
    );
  }, [search, posts]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to BloggerClone</h1>
        <p className="text-gray-600 text-lg">Discover the latest articles and insights</p>
      </div>
      
      {/* Search input - Update placeholder to include categories */}
      <div className="mb-6 flex justify-center">
        <input
          className="border rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blog-primary"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search posts by title, summary, content, or categories..."
        />
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
      
      {!isLoading && filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts found. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Index;
