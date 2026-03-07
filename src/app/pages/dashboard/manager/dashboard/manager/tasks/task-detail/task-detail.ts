import { ChangeDetectorRef, Component, computed, inject } from '@angular/core';
import { BackButtonComponent } from '../../../../../../../shared/components/back-button/back-button';
import { HeaderComponent } from '../../../../../../../shared/components/header/header';
import { TaskService } from '../../../../../../../core/services/task.service';
import { ActivatedRoute } from '@angular/router';
import { DueDateInfo, DueDateService } from '../../../../../../../shared/services/due-date.service';
import { CommonModule } from '@angular/common';
import { SubTask, TaskData } from '../../../../../../../shared/models/task.model';
import {
  Status,
  SubTaskCreateDTO,
  SubTaskDTO,
  UserDTO,
} from '../../../../../../../shared/models/workflow.model';
import { AuthService } from '../../../../../../../core/services/auth.service';
import { AdminService } from '../../../../../../../core/services/admin.service';
import { signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
// import {DropdownModule} from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { toast } from 'ngx-sonner';
import { CommentDto } from '../../../../../../../shared/models/comment.model';
import { CommentService } from '../../../../../../../core/services/comment.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-task-detail',
  imports: [BackButtonComponent, HeaderComponent, CommonModule, DialogModule, ReactiveFormsModule,FormsModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export default class TaskDetail {
  public taskId: string | null;
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private dueDateService = inject(DueDateService);
  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private userService = inject(AdminService);
  private commentService = inject(CommentService);

  public role:string = '';
  task = signal<TaskData | null>(null);
  user = signal<UserDTO | null>(null);
  dueDate = signal<DueDateInfo | null>(null);
  isSubtaskDialogVisible = signal(false);
  availableUsers = signal<UserDTO[]>([]);
  comments = signal<any[]>([]);
  comment_user : UserDTO | null   =null ;
  formText: string = '';
  managerUserId?: number;
  private commentsSubscriber?:Subscription;
  ngOnInit(): void {
    if (this.taskId) {
      this.getTaskById();
      this.getRole();
      // this.getComments();
      this.setupCommentsSubscription();
    }
  }

  isManager = signal(false);

  constructor() {
    this.taskId = this.route.snapshot.paramMap.get('taskId');
  }
  getTaskById() {
    this.taskService.getTaskById(this.taskId as unknown as number).subscribe({
      next: (res) => {
        console.log(res);
        this.task.set(res.data);
        this.getUserById(res.data.assignedToUser);
      },
      error: (err) => {
        console.log(err.error);
        toast.error("Error Loading tasks")
      },
    });
  }

  getUserById(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.user.set(res.data);
      },
      error: (err) => {
        console.log(err.error);
      toast.error("Error Loading tasks")
      },
    });
  }

  getRole(){
    this.role = this.authService.getRoleFromToken();
    if(this.role == "MANAGER"){
      this.isManager.set(true);
    }
  }

  toggleSubStatus(taskId: number, subTaskId: number, currentStatus: string) {
    // 1. Determine the new status
    const newStatus = currentStatus === 'COMPLETED' ? 'OPEN' : 'COMPLETED';

    this.taskService.updateSubTaskStatus(taskId, subTaskId, newStatus).subscribe({
      next: () => {
        // 2. Update the Signal locally
        this.task.update((currentTask) => {
          if (!currentTask) return null;

          // Map through subtasks and update the specific one
          const updatedSubTasks = currentTask.subTasks.map((sub) =>
            sub.subTaskId === subTaskId ? { ...sub, status: newStatus as any } : sub,
          );

          // Return a new object to trigger the Signal's reactivity
          return { ...currentTask, subTasks: updatedSubTasks };
        });

        console.log(`Subtask ${subTaskId} updated to ${newStatus}`);
        toast.success(`Subtask ${subTaskId} updated to ${newStatus}`)
      },
      error: (err) => {
        console.error('Failed to update subtask status', err);
        toast.error('Failed to update subtask status ')
        // Optional: Show a toast notification here
      },
    });
  }

  getDueDate = computed(() => {
    const currentTask = this.task();

    if (!currentTask || !currentTask.dueDate) {
      return null;
    }
    return this.dueDateService.calculateDueDate(currentTask?.dueDate);
  });

  // Computed signal: Automatically recalculates only when task() changes
  completionPercentage = computed(() => {
    const currentTask = this.task();
    if (!currentTask?.subTasks?.length) return 0;

    const completed = currentTask.subTasks.filter((s) => s.status === 'COMPLETED').length;
    return Math.round((completed / currentTask.subTasks.length) * 100);
  });

  subtaskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    status: new FormControl('OPEN'),
  });
  
  

  showCreateDialog() {
    this.subtaskForm.reset({ status: 'OPEN' });
    this.isSubtaskDialogVisible.set(true);

    // Fetch users if the list is empty
    if (this.availableUsers().length === 0) {
      this.userService.getAllUsers().subscribe((res) => this.availableUsers.set(res.data));
    }
  }
 saveSubtask() {
  if (this.subtaskForm.invalid || !this.task()) return;

  const formValues = this.subtaskForm.getRawValue();
  const payload: SubTaskCreateDTO = {
    title: formValues.title!,
    status: Status.Open,
    taskId: this.task()!.taskId,
  };
  

  this.taskService.createSubTask(payload).subscribe({
    next: (res) => {
      // 1. Close the dialog FIRST
      this.isSubtaskDialogVisible.set(false);
      
      // 2. FORCE Angular to run Change Detection now
      this.cdr.detectChanges(); 

      // 3. Update the UI list
      const newSubTask = res.data as unknown as SubTask;
      this.task.update((current) => {
        if (!current) return null;
        return {
          ...current,
          subTasks: [...current.subTasks, newSubTask],
        };
      });

      // 4. Reset the form LAST
      this.subtaskForm.reset({ status: 'OPEN' });
      window.location.reload();
    },
    error: (err) => console.error(err),
  });
}
onDelete(subTaskId: number) {
  const currentTask = this.task();
  
  if (currentTask && confirm('Are you sure you want to delete this subtask?')) {
    this.taskService.deleteSubTask(currentTask.taskId, subTaskId).subscribe({
      next: () => {
        // Refresh the page to show the updated list and clear any UI state
        toast.info("Sub task with id: " + subTaskId +  " was deleted" )
        this.task.update((prev) => {
        if (!prev) return null;

        // Create a new task object with the subtask removed
        return {
          ...prev,
          subTasks: prev.subTasks.filter((s) => s.subTaskId !== subTaskId)
        };
      });
      },
      error: (err) => {
        console.error('Failed to delete subtask', err);
 toast.error('Failed to delete subtask')
      }
    });
  }
}
  private setupCommentsSubscription() {
    this.commentsSubscriber = this.commentService
      .getAllCommentsForByPolling(parseInt(this.taskId!))
      .subscribe({
        next: (res: any) => {
          const commentData = Array.isArray(res) ? res : res.data || [];
          this.comments.set(commentData);
        },
        error: (err) => {
          if (err.status === 404) this.comments.set([]);
        }
      });
  }

  // REPLACED: Simple refresh instead of manual mapping
  getComments() {
    const id = Number(this.taskId);
    this.commentService.getAllCommentsForByPolling(id).subscribe({
      next: (res: any) => {
        const commentData = Array.isArray(res) ? res : res.data || [];
        this.comments.set(commentData);
      }
    });
  }

  addComment() {
    if (!this.formText.trim()) return;
    
    const dto: CommentDto = {
      taskId: Number(this.taskId),
      text: this.formText
    };

    this.commentService.addComment(dto).subscribe({
      next: () => {
        this.formText = ''; 
        this.getComments(); 
      }
    });
  }

}
