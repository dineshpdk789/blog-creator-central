
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { fetchPostBySlug } from '@/services/postService';
import { formatDate } from '@/utils/date';
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
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>

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
          {/* Enhanced styling for HTML content */}
          <div 
            dangerouslySetInnerHTML={{ __html: content }} 
            className="post-content" 
          />
        </div>
      </article>

      {/* Add CSS for proper HTML tag rendering */}
      <style jsx global>{`
        .post-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        
        .post-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        
        .post-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        
        .post-content p {
          margin-bottom: 1.25rem;
          line-height: 1.7;
        }
        
        .post-content code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.9em;
          padding: 0.2em 0.4em;
          background-color: rgba(0, 0, 0, 0.06);
          border-radius: 3px;
        }
        
        .post-content pre {
          background-color: #282c34;
          color: #abb2bf;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .post-content pre code {
          background-color: transparent;
          padding: 0;
          font-size: 0.9em;
          color: inherit;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          white-space: pre;
        }
        
        .post-content a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .post-content a:hover {
          text-decoration: none;
        }
        
        .post-content ul, .post-content ol {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding-left: 2rem;
        }
        
        .post-content ul {
          list-style-type: disc;
        }
        
        .post-content ol {
          list-style-type: decimal;
        }
        
        .post-content li {
          margin-bottom: 0.5rem;
        }
        
        .post-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          font-style: italic;
          margin: 1.5rem 0;
          color: #6b7280;
        }
        
        .post-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 1.5rem 0;
        }
        
        /* Dark mode adjustments */
        .dark .post-content code {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .dark .post-content pre {
          background-color: #1a1a1a;
          color: #e6e6e6;
        }
        
        .dark .post-content blockquote {
          border-left-color: #4b5563;
          color: #9ca3af;
        }
      `}</style>
    </Layout>
  );
};

export default Post;
