export interface FileMetadata {
  id: string;
  filename: string;
  createdAt: string;
  updatedAt: string;
  size: number;
}

export interface FileWithContent extends FileMetadata {
  content: string;
}

export interface ListFilesResponse {
  files: FileMetadata[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateFileRequest {
  filename: string;
  content: string;
}

export interface UpdateFileRequest {
  filename?: string;
  content?: string;
}

export interface ErrorResponse {
  error: string;
  details?: unknown;
}