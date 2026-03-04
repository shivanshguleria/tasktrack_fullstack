export interface CommentDto {
  taskId: number;
  text: string;
}

export interface Comment {
  id?: number; 
  taskId: number;
  text: string;
  userId?: number; // Optional, if you want to track who made the comment
  // Add other fields returned by your Spring 'Comment' entity (e.g., author, createdAt)
  createdAt?: string; 
}