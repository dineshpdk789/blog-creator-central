
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getAllPosts, deletePost } from '@/data/posts';
import { Post } from '@/types/blog';
import { formatDate } from '@/utils/date';
import { checkAuth } from '@/utils/auth';
import { PenIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [deleteDialog, setDeleteDialog] = React.useState<{ open: boolean; postId: string; title: string }>({
    open: false,
    postId: '',
    title: '',
  });
  
  React.useEffect(() => {
    const isAdmin = checkAuth();
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    const fetchedPosts = getAllPosts();
    setPosts(fetchedPosts);
  }, [navigate]);
  
  const handleDeletePost = (id: string) => {
    const success = deletePost(id);
    if (success) {
      setPosts(posts.filter(post => post.id !== id));
      setDeleteDialog({ open: false, postId: '', title: '' });
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      });
    } else {
      toast({
        title: "Error",
        description: "There was a problem deleting the post.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your blog posts</p>
        </div>
        
        <Link to="/admin/create">
          <Button className="bg-blog-primary hover:bg-blog-primary/90">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet. Create your first post!</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="w-[150px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Link 
                      to={`/post/${post.slug}`} 
                      className="font-medium hover:text-blog-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(post.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/edit/${post.id}`}>
                        <Button size="sm" variant="outline">
                          <PenIcon className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => setDeleteDialog({ 
                          open: true, 
                          postId: post.id, 
                          title: post.title 
                        })}
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete <strong>{deleteDialog.title}</strong>?</p>
            <p className="text-gray-500 text-sm mt-1">This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialog({ open: false, postId: '', title: '' })}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDeletePost(deleteDialog.postId)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Admin;
