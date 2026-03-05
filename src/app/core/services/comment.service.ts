import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, share, shareReplay, switchMap, timer } from 'rxjs';
import { Comment, CommentDto } from '../../shared/models/comment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  
  private apiUrl = environment.apiUrl+'/comments'; // Adjust to your server port

  constructor(private http: HttpClient) {}

  // POST: Add a new comment
  addComment(comment: CommentDto): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  // GET: Get all comments for a task
  getCommentsByTask(taskId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/task/${taskId}`);
  }

  getAllCommentsForByPolling(taskId:number):Observable<Comment[]> {
    return timer(0, 1000).pipe(switchMap(() => this.getCommentsByTask(taskId)),  shareReplay(1))
   
  }
}