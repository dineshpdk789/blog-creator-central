
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { getPostBySlug } from '@/data/posts';
import { formatDate } from '@/utils/date';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;
  
  React.useEffect(() => {
    if (!post) {
      navigate('/');
    }
  }, [post, navigate]);
  
  if (!post) {
    return null;
  }
  
  const { title, content, images, createdAt, updatedAt } = post;
  const formattedContent = content.split('\n\n').map((paragraph, index) => (
    <p key={index} className="mb-4">{paragraph}</p>
  ));
  
  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        
        <div className="text-gray-500 mb-6">
          <span>Posted on {formatDate(createdAt)}</span>
          {createdAt !== updatedAt && (
            <span className="ml-4">Updated on {formatDate(updatedAt)}</span>
          )}
        </div>
        
        {images.length > 0 && (
          <div className="mb-8">
            {images.length === 1 ? (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/${images[0]}`}
                  alt={title}
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="rounded-lg overflow-hidden aspect-[16/9]">
                        <img 
                          src={`https://images.unsplash.com/${image}`}
                          alt={`${title} - image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            )}
          </div>
        )}
        
        <div className="prose prose-lg max-w-none">
          {formattedContent}
        </div>
      </article>
    </Layout>
  );
};

export default Post;
