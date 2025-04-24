
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { fetchPostBySlug } from '@/services/postService';
import { formatDate } from '@/utils/date';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => slug ? fetchPostBySlug(slug) : null,
    enabled: !!slug
  });

  React.useEffect(() => {
    if (!isLoading && !post && !error) {
      navigate('/');
    }
  }, [post, isLoading, error, navigate]);

  const handleShare = async () => {
    const currentUrl = window.location.href;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || 'Check out this post!',
          url: currentUrl,
        });
      } else {
        await navigator.clipboard.writeText(currentUrl);
        toast('Link copied to clipboard', {
          description: 'You can now paste the link to share this post',
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
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

  if (error || !post) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500">Error loading post. Please try again later.</p>
        </div>
      </Layout>
    );
  }

  const { title, content, images, created_at, updated_at } = post;

  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 size={18} />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>

        <div className="text-gray-500 dark:text-gray-300 mb-6">
          <span>Posted on {formatDate(created_at)}</span>
          {created_at !== updated_at && (
            <span className="ml-4">Updated on {formatDate(updated_at)}</span>
          )}
        </div>

        {images.length > 0 && (
          <div className="mb-8">
            {images.length === 1 ? (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={images[0].startsWith('http') ? images[0] : `https://images.unsplash.com/${images[0]}`}
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
                          src={image.startsWith('http') ? image : `https://images.unsplash.com/${image}`}
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

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div 
            dangerouslySetInnerHTML={{ __html: content }} 
            className="post-content" 
          />
        </div>
      </article>
    </Layout>
  );
};

export default Post;
