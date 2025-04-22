
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Post } from '@/types/blog';
import { formatDate } from '@/utils/date';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { title, excerpt, slug, images, created_at } = post;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/post/${slug}`}>
        {images.length > 0 && (
          <AspectRatio ratio={16 / 9}>
            <img 
              src={`https://images.unsplash.com/${images[0]}`}
              alt={title}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        )}
        
        <CardHeader>
          <h2 className="text-xl font-bold line-clamp-2 hover:text-blog-primary transition-colors">{title}</h2>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-600 line-clamp-3">{excerpt}</p>
        </CardContent>
        
        <CardFooter className="text-sm text-gray-500">
          {formatDate(created_at)}
        </CardFooter>
      </Link>
    </Card>
  );
};

export default PostCard;
