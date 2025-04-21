
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Post } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';

interface PostFormProps {
  post?: Post;
  onSubmit: (data: {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    images: string[];
  }) => void;
}

const PostForm = ({ post, onSubmit }: PostFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = React.useState(post?.title || '');
  const [content, setContent] = React.useState(post?.content || '');
  const [excerpt, setExcerpt] = React.useState(post?.excerpt || '');
  const [slug, setSlug] = React.useState(post?.slug || '');
  const [imageUrls, setImageUrls] = React.useState<string>(post?.images.join('\n') || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !excerpt || !slug) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Process image URLs
    const images = imageUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url !== '');
    
    onSubmit({
      title,
      content,
      excerpt,
      slug: slug.toLowerCase().replace(/[^\w-]+/g, '-'),
      images,
    });
  };
  
  const generateSlug = () => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
      
    setSlug(generatedSlug);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          required
        />
      </div>
      
      <div className="flex gap-2 items-end">
        <div className="space-y-2 flex-1">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-url-slug"
            required
          />
        </div>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={generateSlug}
          className="mb-[1px]"
        >
          Generate from Title
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Write a short summary of your post"
          className="resize-none"
          rows={2}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here..."
          className="min-h-[200px]"
          rows={10}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="images">
          Images (one Unsplash ID per line)
        </Label>
        <Textarea
          id="images"
          value={imageUrls}
          onChange={(e) => setImageUrls(e.target.value)}
          placeholder="photo-1649972904349-6e44c42644a7"
          className="resize-none"
          rows={3}
        />
        <p className="text-xs text-gray-500">
          Enter Unsplash IDs, one per line (e.g., photo-1649972904349-6e44c42644a7)
        </p>
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-blog-primary hover:bg-blog-primary/90"
        >
          {post ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
