
import React from 'react';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { getAllPosts } from '@/data/posts';
import { Post } from '@/types/blog';

const Index = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  
  React.useEffect(() => {
    const fetchedPosts = getAllPosts();
    setPosts(fetchedPosts);
  }, []);
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to BloggerClone</h1>
        <p className="text-gray-600 text-lg">Discover the latest articles and insights</p>
      </div>
      
      {posts.length === 0 ? (
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
