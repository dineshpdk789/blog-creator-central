
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  images: string[];
  categories: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface FilterParams {
  category?: string;
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  sortBy?: 'created_at' | 'updated_at' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface PostsResponse {
  data: Post[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class ApiError extends Error {
  status: number;
  code: string;
  
  constructor(message: string, status: number = 500, code: string = 'unknown_error') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
  
  static notFound(message: string = 'Resource not found'): ApiError {
    return new ApiError(message, 404, 'not_found');
  }
  
  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return new ApiError(message, 401, 'unauthorized');
  }
  
  static badRequest(message: string = 'Bad request'): ApiError {
    return new ApiError(message, 400, 'bad_request');
  }
}
