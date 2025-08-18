import { Comment, CreateCommentInput } from '../types/comment';
import { apiPost, apiGet, apiDelete } from './client';

export async function createComment(fileId: string, input: CreateCommentInput): Promise<Comment> {
  return apiPost(`/api/v1/files/${fileId}/comments`, input);
}

export async function getComments(fileId: string): Promise<Comment[]> {
  return apiGet(`/api/v1/files/${fileId}/comments`);
}

export async function deleteComment(fileId: string, commentId: string): Promise<void> {
  return apiDelete(`/api/v1/files/${fileId}/comments/${commentId}`);
}