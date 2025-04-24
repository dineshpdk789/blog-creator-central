import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Post } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/services/postService';
import EditorToolbar from './EditorToolbar';
import ContentEditor from './ContentEditor';
import ContentPreview from './ContentPreview';
import ImagesUploadGallery from './ImagesUploadGallery';

interface PostFormProps {
  post?: Post;
  onSubmit: (data: {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    images: string[];
    categories: string[];
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
  const [showPreview, setShowPreview] = useState(true);
  const [categories, setCategories] = useState<string[]>(post?.categories || []);
  const [newCategory, setNewCategory] = useState('');
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
      categories,
    });
  };

  const generateSlug = () => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  const insertAtSelection = (before: string, after = before) => {
    const ta = contentAreaRef.current;
    if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const val = content;
    const newText =
      val.slice(0, start) + before + val.slice(start, end) + after + val.slice(end);
    setContent(newText);
    setTimeout(() => {
      ta.focus();
      const caret = start + before.length + (end - start) + after.length;
      ta.selectionStart = ta.selectionEnd = caret;
    }, 0);
  };

  const handleFormat = (tag: string) => {
    if (tag === "ul") {
      insertAtSelection('<ul>\n  <li>', '</li>\n</ul>');
    } else if (tag === "ol") {
      insertAtSelection('<ol>\n  <li>', '</li>\n</ol>');
    } else {
      insertAtSelection(`<${tag}>`, `</${tag}>`);
    }
  };

  const insertImageAtSelection = () => {
    const imageUrl = prompt("Enter image URL or Unsplash photo ID (e.g. photo-12345):");
    if (!imageUrl) return;
    if (imageUrl.startsWith('http')) {
      insertAtSelection(`<img src="${imageUrl}" alt="Image" />`, "");
    } else {
      insertAtSelection(`<img src="https://images.unsplash.com/${imageUrl}" alt="Image" />`, "");
    }
  };

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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
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
        >Generate from Title</Button>
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
        <div className="flex items-center">
          <Label htmlFor="content">Content (HTML supported)</Label>
        </div>

        <EditorToolbar
          isSubmitting={isSubmitting}
          onFormat={handleFormat}
          onInsertLink={insertLink}
          onInsertImageByUrl={insertImageAtSelection}
          onClickUploadImage={() => fileInputRef.current?.click()}
          uploading={uploading}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(v => !v)}
        />

        <ContentEditor
          value={content}
          onChange={setContent}
          isSubmitting={isSubmitting}
          textareaRef={contentAreaRef}
          dropAreaRef={dropAreaRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />

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
          <div className="mb-1">
            <strong>Supports raw HTML</strong>: You can use <code>&lt;p&gt;</code>, <code>&lt;h1&gt;</code>, <code>&lt;img&gt;</code>, <code>&lt;code&gt;</code>, etc.
          </div>
          <div>Drag and drop images directly into editor or use the upload button.</div>
        </div>
      </div>

      {showPreview && <ContentPreview content={content} />}

      <div className="space-y-2">
        <Label htmlFor="categories">Categories</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.map((category, index) => (
            <span
              key={index}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-2"
            >
              #{category}
              <button
                type="button"
                onClick={() => handleRemoveCategory(category)}
                className="text-sm hover:text-destructive"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="categories"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add a category (e.g., technology)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCategory();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddCategory}
            disabled={!newCategory.trim()}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Uploaded Images</Label>
        <ImagesUploadGallery images={images} onRemoveImage={removeImage} isSubmitting={isSubmitting} />
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
