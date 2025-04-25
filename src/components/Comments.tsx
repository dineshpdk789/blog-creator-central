
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Comment {
  id: string;
  name: string;
  text: string;
  date: string;
}

interface CommentsProps {
  postId: string;
}

// Mock comments data - in a real app this would come from a database
const mockComments: Record<string, Comment[]> = {
  // Sample comments for demonstration
  "default": [
    { id: "1", name: "Jane Doe", text: "Great article! Very informative.", date: "2023-04-20T12:30:00" },
    { id: "2", name: "John Smith", text: "I learned a lot from this post. Looking forward to more content like this!", date: "2023-04-19T10:15:00" }
  ],
};

const Comments = ({ postId }: CommentsProps) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(() => {
    // Get comments for this post, or use default comments for demonstration
    return mockComments[postId] || mockComments.default || [];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !comment.trim()) {
      toast.error('Please fill in both name and comment');
      return;
    }

    // Create new comment
    const newComment: Comment = {
      id: Date.now().toString(),
      name: name.trim(),
      text: comment.trim(),
      date: new Date().toISOString(),
    };

    // Add to comments list
    setComments(prevComments => [newComment, ...prevComments]);
    
    toast.success('Comment submitted successfully!');
    setName('');
    setComment('');
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-2xl font-bold mb-4">Comments</h3>
      
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-md border border-input px-4 py-2 text-sm"
          />
        </div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="min-h-[100px]"
        />
        <Button type="submit">
          Post Comment
        </Button>
      </form>

      {/* Display existing comments */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-muted-foreground italic">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4 mb-4 last:border-0">
              <div className="flex justify-between mb-1">
                <h4 className="font-semibold">{comment.name}</h4>
                <span className="text-xs text-muted-foreground">{formatDate(comment.date)}</span>
              </div>
              <p className="text-foreground">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
