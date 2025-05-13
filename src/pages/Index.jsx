
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import { Badge } from '@/components/ui/badge';
import { fetchAllPosts } from '@/services/postService';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

const Index = () => {
  // State for pagination and filtering
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10
  });
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  
  const [searchInput, setSearchInput] = useState('');
  const { toast } = useToast();
  
  // Fetch posts with React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['posts', pagination, filters],
    queryFn: () => fetchAllPosts(pagination, filters),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (err) => {
      toast({
        title: 'Error',
        description: err.message || 'Failed to load posts',
        variant: 'destructive'
      });
    }
  });

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchInput }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on new search
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
    setSearchInput('');
    setPagination({ page: 1, pageSize: 10 });
  };
  
  // Filter by category
  const filterByCategory = (category) => {
    setFilters(prev => ({ 
      ...prev, 
      category: prev.category === category ? '' : category 
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };
  
  // Get unique categories from all posts
  const uniqueCategories = useMemo(() => {
    const categories = new Set();
    data?.data.forEach(post => {
      post.categories?.forEach(category => {
        categories.add(category);
      });
    });
    return Array.from(categories).sort();
  }, [data?.data]);
  
  // Handle pagination
  const changePage = (newPage) => {
    if (newPage < 1 || (data && newPage > data.totalPages)) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Generate pagination items
  const paginationItems = useMemo(() => {
    if (!data) return [];
    
    const current = pagination.page || 1;
    const total = data.totalPages;
    
    // Show current page, 2 before and 2 after when possible
    const range = [...Array(Math.min(5, total))].map((_, i) => {
      let pageNum = current - 2 + i;
      
      // Adjust if out of bounds
      if (pageNum < 1) {
        pageNum = 1 + i;
      } else if (pageNum > total) {
        pageNum = total - (4 - i);
      }
      
      if (pageNum >= 1 && pageNum <= total) {
        return pageNum;
      }
      return null;
    }).filter(n => n !== null);
    
    return range;
  }, [data, pagination.page]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to Dinesh Blogs</h1>
        <p className="text-gray-600 text-lg">Discover the latest articles and insights</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {/* Search input */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search posts by title or content..."
                  className="w-full pl-9"
                />
              </div>
              <Button type="submit">Search</Button>
              {(filters.search || filters.category) && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  title="Clear filters"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </form>
          </div>
          
          {/* Active filters */}
          {(filters.search || filters.category) && (
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="text-sm text-gray-500">Active filters:</div>
              {filters.search && (
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1"
                >
                  Search: {filters.search}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => {
                      setFilters(prev => ({ ...prev, search: '' }));
                      setSearchInput('');
                    }}
                  />
                </Badge>
              )}
              {filters.category && (
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1"
                >
                  Category: {filters.category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                  />
                </Badge>
              )}
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blog-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading posts...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading posts. Please try again later.</p>
              <Button 
                onClick={() => refetch()} 
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          )}
          
          {!isLoading && data?.data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts found. Check back later!</p>
              {(filters.search || filters.category) && (
                <Button 
                  onClick={clearFilters}
                  className="mt-4"
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data?.data.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              
              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => changePage((pagination.page || 1) - 1)}
                        className={pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {paginationItems.map(pageNum => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          isActive={pageNum === pagination.page}
                          onClick={() => changePage(pageNum)}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => changePage((pagination.page || 1) + 1)}
                        className={(pagination.page === data.totalPages) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>

        {/* Categories sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold mb-4">#Categories</h2>
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map(category => (
                <Badge
                  key={category}
                  variant={filters.category === category ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => filterByCategory(category)}
                >
                  #{category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
