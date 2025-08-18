// Types for Automerge integration

// Define the structure of our Automerge document
// This should match the backend MarkdownDocument interface
export interface MarkdownDocument {
  content: string;
  metadata?: {
    filename?: string;
    createdAt?: number;
    updatedAt?: number;
  };
}

// Type for the Automerge document URL response
export interface AutomergeUrlResponse {
  automergeUrl: string;
}