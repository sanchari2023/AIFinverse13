// services/postService.ts
import { api } from "./api";

export interface Post {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  status: "draft" | "published";
  category?: string;
  tags: string[];
  meta_description?: string;
  is_featured: boolean;
  read_time: number;
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface PostListResponse {
  id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  featured_image_url?: string;
  author_name: string;
  category?: string;
  tags: string[];
  read_time: number;
  views: number;
  likes: number;
  created_at: string;
  published_at?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  parent_id?: string;
  likes: number;
  created_at: string;
  status: string;
  replies?: Comment[];
}

export interface CommentCreate {
  author_name: string;
  author_email: string;
  content: string;
  parent_id?: string;
}

export const postService = {
  // Get all published posts with pagination
  async getPosts(page: number = 1, limit: number = 10, category?: string | null, tag?: string | null) {
    const params: Record<string, any> = { page, limit };
    
    if (category) {
      params.category = category;
    }
    
    if (tag) {
      params.tag = tag;
    }
    
    const response = await api.get<PostListResponse[]>("/posts", { params });
    return response.data;
  },

  // Get a single post by ID
  async getPostById(postId: string) {
    const response = await api.get<Post>(`/posts/${postId}`);
    return response.data;
  },

  // Get latest featured post
  async getLatestFeatured() {
    const response = await api.get<Post>("/posts/featured/latest");
    return response.data;
  },

  // Add a comment to a post
  async addComment(postId: string, commentData: CommentCreate) {
    const response = await api.post<Comment>(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  // Get comments for a post
  async getComments(postId: string) {
    const response = await api.get<{ post_id: string; total_comments: number; comments: Comment[] }>(
      `/posts/${postId}/comments`
    );
    return response.data;
  },

  // Like a comment
  async likeComment(commentId: string) {
    const response = await api.post<{ likes: number }>(`/comments/${commentId}/like`);
    return response.data;
  },

  // Get posts by category
  async getPostsByCategory(category: string, page: number = 1, limit: number = 10) {
    return this.getPosts(page, limit, category);
  },

  // Get posts by tag
  async getPostsByTag(tag: string, page: number = 1, limit: number = 10) {
    return this.getPosts(page, limit, undefined, tag);
  }
};