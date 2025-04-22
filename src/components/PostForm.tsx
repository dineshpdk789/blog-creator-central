
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Post } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';
import { Bold, Italic, Underline, Image, Upload, X } from "lucide-react";
import { uploadImage } from '@/services/postService';

interface PostFormProps {
  post?: Post;
  onSubmit: (data: {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    images: string[];
  }) => void;
  isSubmitting?: boolean;
}

const PostForm = ({ post, onSubmit, isSubmitting = false }: PostFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [images, setImages] = useState<string[]>(post?.images || []);
  const [uploading, setUploading] = useState(false);
  const contentAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Helper for formatting: Inserts or wraps selection with tags
  const insertAtSelection = (before: string, after = before) => {
    const ta = contentAreaRef.current;
    if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const val = content;
    const newText =
      val.slice(0, start) + before + val.slice(start, end) + after + val.slice(end);
    setContent(newText);
    // Move caret after the inserted text
    setTimeout(() => {
      ta.focus();
      const caret = start + before.length + (end - start) + after.length;
      ta.selectionStart = ta.selectionEnd = caret;
    }, 0);
  };

  // For inserting image by URL or Unsplash ID
  const insertImageAtSelection = () => {
    const imageUrl = prompt("Enter image URL or Unsplash photo ID (e.g. photo-12345):");
    if (!imageUrl) return;
    insertAtSelection(`[img]${imageUrl}[/img]`, "");
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setImages([...images, ...uploadedUrls]);
      
      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${files.length} image${files.length > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was a problem uploading your images.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
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
          disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={generateSlug}
          className="mb-[1px]"
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        {/* Formatting controls */}
        <div className="flex gap-2 mb-1">
          <Button type="button" variant="ghost" size="icon" aria-label="Bold" onClick={() => insertAtSelection("**", "**")} disabled={isSubmitting}>
            <Bold />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Italic" onClick={() => insertAtSelection("*", "*")} disabled={isSubmitting}>
            <Italic />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Underline" onClick={() => insertAtSelection("__", "__")} disabled={isSubmitting}>
            <Underline />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Add Image" onClick={insertImageAtSelection} disabled={isSubmitting}>
            <Image />
          </Button>
        </div>
        <Textarea
          id="content"
          value={content}
          ref={contentAreaRef}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here... (use formatting buttons above)"
          className="min-h-[200px] font-mono"
          rows={10}
          required
          disabled={isSubmitting}
        />
        <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-3">
          <div>Formatting: <b>**bold**</b>, <i>*italic*</i>, <span style={{ textDecoration: "underline" }}>__underline__</span></div>
          <div>Image: <code>[img]photo-1234[/img]</code> or <code>[img]https://example.com/image.jpg[/img]</code></div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">
          Images
        </Label>
        
        <div className="flex flex-wrap gap-4 mt-2">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image.startsWith('http') ? image : `https://images.unsplash.com/${image}`}
                alt={`Upload ${index + 1}`}
                className="w-32 h-32 object-cover rounded-md border"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                disabled={isSubmitting}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={isSubmitting || uploading}
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting || uploading}
            >
              <Upload size={20} className="mr-1" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500">
          Upload images or use Unsplash IDs in your content
        </p>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-blog-primary hover:bg-blog-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              {post ? 'Updating Post...' : 'Creating Post...'}
            </>
          ) : (
            post ? 'Update Post' : 'Create Post'
          )}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
