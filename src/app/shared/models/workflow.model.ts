export enum Status {
  Pending = "PENDING",
  Open = "OPEN",
  InProgress = "INPROGRESS",
  Completed = "COMPLETED"
}

export enum Priority {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH"
}

// Specific statuses for Task items
export enum TaskStatus {
  Open = "OPEN",
  InProgress = "IN_PROGRESS",
  Completed = "COMPLETED",
  Blocked = "BLOCKED"
}

export enum WorkflowStepStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface UserDTO {
  userId: number;
  userName: string;
  email: string;
  department:  string; // Keeping it flexible but noting IT as the default
}

export interface NewWorkflowDTO {
  workflowTemplateId: number|null;
  workflowName: string
}

export interface UpdateWorkflowStepRequest {
  stepStatus: WorkflowStepStatus;
  taskId?: number | null|any;
  message?: string;
}
export interface SubTaskDTO {
  subTaskId: number;
  status: Status;
  title: string;
  assignedToUserId: number;

}


export interface SubTaskCreateDTO {
  taskId:number;
  status: Status;
  title: string;

  
}

export interface TaskDTO {
  taskId: number;
  title: string;
  description: string;
  assignedToUser: UserDTO;
  createdByUser: UserDTO;
  subTasks: SubTaskDTO[];
  priority: Priority;
  status: TaskStatus;
  dueDate: Date;
}

export interface WorkflowStepDTO {
  workflowStepId: number;
  stepName: string;
  status: WorkflowStepStatus;
  task: TaskDTO[];
}

export interface WorkflowDTO {
  workflowId: number;
  workflowName: string;
  currentStep: number;
  status: Status;
  workflowSteps: WorkflowStepDTO[];
}

export const StatusConfig = {
  [Status.Pending]: { 
    label: 'Pending', 
    class: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' 
  },
  [Status.Open]: { 
    label: 'Open', 
    class: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20' 
  },
  [Status.InProgress]: { 
    label: 'In Progress', 
    class: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20' 
  },
  [Status.Completed]: { 
    label: 'Completed', 
    class: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
  },
};

export const WorkflowStepStatusConfig = {
  [WorkflowStepStatus.PENDING]: { 
    label: 'PENDING', 
    class: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' 
  },
  [WorkflowStepStatus.REJECTED]: { 
    label: 'REJECTED', 
    class: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' 
  },
  [WorkflowStepStatus.APPROVED]: { 
    label: 'COMPLETED', 
    class: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
  },
};

export const TaskStatusConfig = {
  [TaskStatus.Open]: { 
    label: 'Open', 
    class: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20' 
  },
  [TaskStatus.InProgress]: { 
    label: 'In Progress', 
    class: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20' 
  },
  [Status.Completed]: { 
    label: 'Completed', 
    class: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
  },
  [TaskStatus.Blocked]: { 
    label: 'Blocked', 
    class: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20' 
  }
};

export const PriorityConfig = {
  [Priority.Low]: { 
    label: 'Low', 
    class: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-500/10 dark:text-zinc-400 dark:border-zinc-500/20' 
  },
  [Priority.Medium]: { 
    label: 'Medium', 
    class: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' 
  },
  [Priority.High]: { 
    label: 'High', 
    class: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' 
  }
};


