
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Post } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';
import { Bold, Italic, Underline, Image, Upload, X, Code, List, ListOrdered, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon } from "lucide-react";
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
  const dropAreaRef = useRef<HTMLDivElement>(null);

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

  // HTML formatting helpers
  const insertHTML = (tag: string) => {
    const ta = contentAreaRef.current;
    if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const selectedText = content.slice(start, end);
    
    insertAtSelection(`<${tag}>`, `</${tag}>`);
  };

  // For inserting image by URL or Unsplash ID
  const insertImageAtSelection = () => {
    const imageUrl = prompt("Enter image URL or Unsplash photo ID (e.g. photo-12345):");
    if (!imageUrl) return;
    
    if (imageUrl.startsWith('http')) {
      insertAtSelection(`<img src="${imageUrl}" alt="Image" />`, "");
    } else {
      insertAtSelection(`<img src="https://images.unsplash.com/${imageUrl}" alt="Image" />`, "");
    }
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    handleFileUpload(Array.from(files));
  };

  const handleFileUpload = async (files: File[]) => {
    setUploading(true);
    
    try {
      const uploadPromises = files.map(file => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setImages([...images, ...uploadedUrls]);
      
      // Insert images into content area
      uploadedUrls.forEach(url => {
        const imgTag = `<img src="${url}" alt="Uploaded image" />\n`;
        setContent(prevContent => prevContent + imgTag);
      });
      
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

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add('bg-gray-100', 'dark:bg-gray-800');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('bg-gray-100', 'dark:bg-gray-800');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('bg-gray-100', 'dark:bg-gray-800');
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(Array.from(e.dataTransfer.files));
    }
  }, []);

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    const text = prompt("Enter link text:");
    if (url && text) {
      insertAtSelection(`<a href="${url}" target="_blank">`, `${text}</a>`);
    } else if (url) {
      insertAtSelection(`<a href="${url}" target="_blank">`, `${url}</a>`);
    }
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
        <Label htmlFor="content">Content (HTML enabled)</Label>
        
        {/* Formatting controls */}
        <div className="flex flex-wrap gap-2 mb-1">
          <Button type="button" variant="outline" size="icon" title="Bold" onClick={() => insertHTML('b')} disabled={isSubmitting}>
            <Bold size={18} />
          </Button>
          <Button type="button" variant="outline" size="icon" title="Italic" onClick={() => insertHTML('i')} disabled={isSubmitting}>
            <Italic size={18} />
          </Button>
          <Button type="button" variant="outline" size="icon" title="Underline" onClick={() => insertHTML('u')} disabled={isSubmitting}>
            <Underline size={18} />
          </Button>
          <Button type="button" variant="outline" size="icon" title="Code" onClick={() => insertHTML('code')} disabled={isSubmitting}>
            <Code size={18} />
          </Button>
          <Button type="button" variant="outline" size="icon" title="Unordered List" onClick={() => insertAtSelection('<ul>\n  <li>', '</li>\n</ul>')} disabled={isSubmitting}>
            <List size={18} />
          </Button>
          <Button type="button" variant="outline" size="icon" title="Ordered List" onClick={() => insertAtSelection('<ol>\n  <li>', '</li>\n</ol>')} disabled={isSubmitting}>
            <ListOrdered size={18} />
          </Button>
          <Button type="button" variant="outline" size="icon" title="Heading 1" onClick={() => insertHTML('h1')} disabled={isSubmitting}>
            <Heading1 size={18} />
          </Button>
          <Button type="button" variant="outline" size="icon" title="Heading 2" onClick={() => insertHTML('h2')} disabled={isSubmitting}>
            <Heading2 size={18} />
          </Button>
          <Button type="button" variant="outline" size="icon" title="Heading 3" onClick={() => insertHTML('h3')} disabled={isSubmitting}>
            <Heading3 size={18} />
          </Button>
          <Button type="button" variant="outline" size="icon" title="Insert Link" onClick={insertLink} disabled={isSubmitting}>
            <LinkIcon size={18} />
          </Button>
          <Button type="button" variant="outline" size="icon" title="Insert Image by URL" onClick={insertImageAtSelection} disabled={isSubmitting}>
            <Image size={18} />
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            title="Drag and drop or click to upload images"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting || uploading}
          >
            <Upload size={18} />
          </Button>
        </div>
        
        <div 
          ref={dropAreaRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-2 border-dashed rounded-md transition-colors p-1"
        >
          <Textarea
            id="content"
            value={content}
            ref={contentAreaRef}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here... HTML tags are supported for formatting"
            className="min-h-[300px] font-mono"
            rows={15}
            required
            disabled={isSubmitting}
          />
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={isSubmitting || uploading}
        />
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          <div className="mb-1"><strong>HTML is enabled</strong>: You can use tags like <code>&lt;p&gt;</code>, <code>&lt;h1&gt;</code>, <code>&lt;img&gt;</code>, etc.</div>
          <div>Drag and drop images directly into the editor or use the upload button.</div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Uploaded Images</Label>
        
        <div className="flex flex-wrap gap-4 mt-2">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image.startsWith('http') ? image : `https://images.unsplash.com/${image}`}
                alt={`Upload ${index + 1}`}
                className="w-32 h-32 object-cover rounded-md border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
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
        </div>
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
              {post ? 'Updating Post...' : 'Create Post...'}
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
