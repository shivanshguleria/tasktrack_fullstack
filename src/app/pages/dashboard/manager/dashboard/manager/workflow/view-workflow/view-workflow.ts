import { ChangeDetectorRef, Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { WorkflowService } from '../../../../../../../core/services/workflow.service';
import { UpdateWorkflowStepRequest } from '../../../../../../../shared/models/workflow.model';
import { Priority, PriorityConfig, TaskStatusConfig, WorkflowDTO, WorkflowStepStatus, WorkflowStepStatusConfig } from '../../../../../../../shared/models/workflow.model';
import { HeaderComponent } from '../../../../../../../shared/components/header/header';
import { StatusConfig } from '../../../../../../../shared/models/workflow.model';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DueDateInfo, DueDateService } from '../../../../../../../shared/services/due-date.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TaskDialogComponent } from '../../../../../../../shared/components/dialog/new-task.component';
import { ConfirmDialogComponent } from '../../../../../../../shared/components/dialog/update-status.component';
import { AdminService } from '../../../../../../../core/services/admin.service';
import { UserResponseDto } from '../../../../../../../shared/models/user.model';
import { NewTaskData } from '../../../../../../../shared/models/newTask.model';
import { TaskService } from '../../../../../../../core/services/task.service';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { toast } from 'ngx-sonner';
import { RejectWorkflowStepStatusComponent } from '../../../../../../../shared/components/dialog/update-reject-workflow-status.component';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-view-workflow',
  imports: [RejectWorkflowStepStatusComponent,InputTextModule,HeaderComponent, ConfirmDialogComponent,  MenuModule, StepperModule, ButtonModule, CommonModule, RouterLink, DialogModule, TaskDialogComponent],
  templateUrl: './view-workflow.html',
  standalone: true,
})
export default class ViewWorkflow {
   items: MenuItem[] | undefined;
  private workflowId: string | null;
  private route = inject(ActivatedRoute);
  isLoading = signal(true);
  isUpdating = signal(false);

  rejectDialogOpenFlag = signal(false)
  private destroy$ = new Subject<void>();
  private workflowService = inject(WorkflowService);
  private dueDateService = inject(DueDateService);
  private cdr = inject(ChangeDetectorRef);


  workFlowStepToAddTaskTo = signal<null| number>(null)

  isNewTaskDialogVisible = false;
  dialogOpen = signal(false);
  changeStatusDialogOpenerFlag = signal(false)
  dialogStatusLabel = signal('');
  selectedStepId = signal<number | null>(null);
  selectedStatus = signal<WorkflowStepStatus | null>(null);
allUsers!: UserResponseDto[]
 
  workflowStatus!: { label: string; class: string };
  workflow = signal<WorkflowDTO | null>(null);
  statusConfig = StatusConfig;
  priorityConfig = PriorityConfig;
  taskStatusConfig = TaskStatusConfig;
  workflowStepStatusConfig = WorkflowStepStatusConfig;
  openDropdownId = signal<number | null>(null);

  stepStatusOptions = [
    { label: 'Pending', value: WorkflowStepStatus.PENDING },
    { label: 'Approved', value: WorkflowStepStatus.APPROVED },
    { label: 'Rejected', value: WorkflowStepStatus.REJECTED }
  ];


  
 allAssigness = computed(() => {
  const currentWorkflow = this.workflow();

    if (!currentWorkflow || !currentWorkflow.workflowSteps) return ;
  const allUsers = currentWorkflow.workflowSteps.flatMap(el => el.task.flatMap(e => e.assignedToUser))
  const uniqueUsers = [
  ...new Map(allUsers.map(user => [user.userId, user])).values()
];
return uniqueUsers;
})
 currentIndex = computed(() => {
  const currentWorkflow = this.workflow();
  
  // 1. Safety check for null workflow
  if (!currentWorkflow || !currentWorkflow.workflowSteps) return 0;

  // 2. Find the index
  const stepIndex = currentWorkflow.workflowSteps.findIndex(
    el => el.status == "PENDING"
  );

console.log(stepIndex, currentWorkflow.workflowSteps)
  return stepIndex === -1 ? currentWorkflow.workflowSteps.length  : stepIndex + 1;
});
  dueDateMap = computed(() => {
    const currentWorkflow = this.workflow();
    if (!currentWorkflow) return new Map<string, DueDateInfo>();
    
    const map = new Map<string, DueDateInfo>();
    currentWorkflow.workflowSteps?.forEach(step => {
      step.task?.forEach(task => {
        map.set(task.taskId.toString(), this.dueDateService.calculateDueDate(task.dueDate));
      });
    });
    return map;
  });

  constructor(private userService:AdminService,private taskService:TaskService) {
    this.workflowId = this.route.snapshot.paramMap.get('workflowId');


  }

  ngOnInit(): void {
    this.getWorkflow();
    this.loadUsers();
  }
  loadUsers(): void {
   this.isLoading.set(true)
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.allUsers = res.data.filter(el => el.role === "EMPLOYEE") || [];
       this.isLoading.set(false)
        this.cdr.detectChanges();
      },
      error: () =>  this.isLoading.set(false)
    });
  }
  getWorkflow(): void {
    this.isLoading.set(true);
    this.workflowService.getWorkflowById(this.workflowId as string)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.workflow.set(res.data);
          this.workflowStatus = StatusConfig[res.data.status];
          this.isLoading.set(false);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching workflow:', err);
           toast.error("Error fetching workflows", {description: "We encoutered an error while fething all workflows, please try again later"})
                    
          this.isLoading.set(false);
        },
        complete: () => {
          console.log('Observable completed');
        }
      });
  }


  onNewTaskCreationRequest(taskData: NewTaskData) {
    this.isUpdating.set(true)
    this.taskService.createNewTask(taskData).subscribe({
      next: (res) => {
        console.log(res.data)
        this.isUpdating.set(false)
        this.dialogOpen.set(false);
        this.getWorkflow()
         toast.success("Created new task", {description: "A new task was created under workflow step id: " + taskData.workflowStepId})
          
      } ,
      error: (err) => {
        console.log(err)
         toast.error("Error new task", {description: "We encoutered an error while create new task, please try again later"})
          
      }
    })

  }
  toggleDropdown(stepId: number): void {
    const id = stepId;
    console.log(stepId)
    this.openDropdownId.set(this.openDropdownId() === id ? null : id);
  }

  updateStepStatus(stepId: number, newStatus: WorkflowStepStatus): void {
     if(newStatus == WorkflowStepStatus.REJECTED) {
    this.rejectDialogOpenFlag.set(true)
   } else {
   this.selectedStepId.set(stepId);
    this.selectedStatus.set(newStatus);
    this.dialogStatusLabel.set(
      this.stepStatusOptions.find(opt => opt.value === newStatus)?.label || ''
    );
    this.openDropdownId.set(null);
   this.changeStatusDialogOpenerFlag.set(true)
   }
 
  
  }
handleRejectDialogClose(success: boolean) {
  if(success) {
    this.getWorkflow()
        this.openDropdownId.set(null);
        toast.success("Workflow Step status updated")
  }
  this.rejectDialogOpenFlag.set(false)
}
  onDialogConfirm(): void {
    const wf = this.workflow();
    if (!wf || !this.selectedStepId() || !this.selectedStatus()) return;
//TODO Add sonnar component
    this.isUpdating.set(true);
    const request: UpdateWorkflowStepRequest = {
      stepStatus: this.selectedStatus()!,
  
    };

    this.workflowService.updateWorkflowStepStatus(wf.workflowId, this.selectedStepId()!, request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Workflow step updated successfully:', res);
           this.changeStatusDialogOpenerFlag.set(false)
          this.getWorkflow();
          this.isUpdating.set(false);
           toast.success("Workflow Step Status changed", {description: "Workflow Step status changed to " + this.selectedStatus()!})
          
          //TODO Add sonnar setup
        },
        error: (err:HttpErrorResponse) => {
          console.error('Error updating workflow step:', );
          
          this.isUpdating.set(false);
          toast.error("Error Updating Status", {description: err.error.error})
           //TODO Add sonnar setup
        }
      });
  }

  onDialogCancel(): void {
 this.changeStatusDialogOpenerFlag.set(true)
    this.selectedStepId.set(null);
    this.selectedStatus.set(null);
  }


    onNewTaskDialogCancel(): void {
    this.dialogOpen.set(false);
    // this.selectedStepId.set(null);
    // this.selectedStatus.set(null);
  }
  toggleNewTaskDialog(): void {
    this.dialogOpen.set(!this.dialogOpen())
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDueDateInfo(taskId: string | number): DueDateInfo | undefined {
    return this.dueDateMap().get(taskId.toString());
  }

  formatDate(date: string | Date): string {
    return this.dueDateService.formatDate(date);
  }
}
