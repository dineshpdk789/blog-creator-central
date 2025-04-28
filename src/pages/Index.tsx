
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { Badge } from '@/components/ui/badge';
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
      post.categories?.some(category => 
        category.toLowerCase().includes(s)
      )
    );
  }, [search, posts]);

  // Get unique categories from all posts
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    posts.forEach(post => {
      post.categories?.forEach(category => {
        categories.add(category);
      });
    });
    return Array.from(categories).sort();
  }, [posts]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to Coding Blogs</h1>
        <p className="text-gray-600 text-lg">Discover the latest articles and insights</p>
      </div>
      
      <div className="flex gap-6">
        <div className="flex-1">
          {/* Search input */}
          <div className="mb-6 flex justify-center">
            <input
              className="border rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blog-primary"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts by title or categories..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Categories sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold mb-4">#Categories</h2>
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map(category => (
                <Badge
                  key={category}
                  variant={search.toLowerCase() === category.toLowerCase() ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => setSearch(category)}
                >
                  #{category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

