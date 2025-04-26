
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatDate } from '@/utils/date';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const PostCard = ({ post }) => {
  const { title, excerpt, slug, images, created_at } = post;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/post/${slug}`}>
        {images && images.length > 0 && (
          <AspectRatio ratio={16 / 9}>
            <img 
              src={images[0].startsWith('http') ? images[0] : `https://images.unsplash.com/${images[0]}`}
              alt={title}
              className="object-cover w-full h-full"
              onError={(e) => {
                const target = e.target;
                target.src = "/placeholder.svg";
              }}
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
