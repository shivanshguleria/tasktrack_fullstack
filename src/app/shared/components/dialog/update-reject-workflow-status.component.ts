import { ChangeDetectorRef, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkflowStepStatus, Priority, TaskStatus, NewWorkflowDTO, UpdateWorkflowStepRequest, TaskDTO } from '../../models/workflow.model';
import { AdminService } from '../../../core/services/admin.service';
import { UserResponseDto } from '../../models/user.model';
import { form, FormField, min, required } from '@angular/forms/signals';
import { WorkflowService } from '../../../core/services/workflow.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';
// Matches the wireframe's intent for a new task


@Component({
  selector: 'app-update-reject-workflow-step',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormField],
  template:`@if (isOpen()) {
  <div class="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md transition-opacity" (click)="onCancel()"></div>
  
  <div class="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
    <div class="bg-zinc-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-lg w-full border border-zinc-800 pointer-events-auto transform transition-all animate-in overflow-hidden relative">
      
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-[60px] pointer-events-none"></div>

      <div class="px-8 py-6 border-b border-zinc-800/60 flex justify-between items-center relative z-10">
        <div>
          <h2 class="text-xl font-black text-white uppercase tracking-tight">Update Step status</h2>
        </div>
        <button (click)="onCancel()" class="p-2 rounded-xl bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
           <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>
      </div>

      <form novalidate class="relative z-10" (submit)="$event.preventDefault()">
        <div class="p-8 space-y-6">
          
          <div class="space-y-2.5">
            <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Select Task</label>
            <select [formField]="updateWorkflowRejectForm.taskId"
                    class="w-full px-4 py-4 text-[10px] font-black border border-zinc-800 rounded-2xl bg-zinc-950 text-indigo-400 uppercase outline-none focus:border-indigo-500 transition-all">
               @for (task of tasks; track task.taskId) {
                <option [value]="task.taskId">{{task.title}}</option>
               }
            </select>
            
            @if (updateWorkflowRejectForm.taskId().invalid() && updateWorkflowRejectForm.taskId().touched()) {
              <div class="space-y-1 mt-2 ml-1">
                @for (e of updateWorkflowRejectForm.taskId().errors(); track e) {
                  <p class="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                    {{ e.message }}
                  </p>
                }
              </div>
            }
          </div>

          <div class="space-y-2.5">
            <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Rejection Reason</label>
            <textarea [formField]="updateWorkflowRejectForm.message!"
                      placeholder="Provide a description as to why this task was rejected"
                      rows="4"
                      class="w-full px-5 py-4 text-sm font-medium border border-zinc-800 rounded-2xl bg-zinc-950 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-inner resize-none"></textarea>
            
           @if (updateWorkflowRejectForm.message!().invalid() && updateWorkflowRejectForm.message!().touched()) {
  <div class="space-y-1 mt-1 ml-1">
    @for (e of updateWorkflowRejectForm.message!().errors(); track e) {
      <p class="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
        {{ e.message }}
      </p>
    }
  </div>
}
          </div>
        </div>

        <div class="bg-zinc-900/50 px-8 py-6 flex gap-4 justify-end border-t border-zinc-800/60">
          <button (click)="onCancel()" 
                  [disabled]="isLoading()"
                  type="button"
                  class="px-5 py-2.5 text-[11px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors disabled:opacity-30">
            Cancel
          </button>
          
          <button (click)="onConfirm()" 
                  [disabled]="isLoading() || updateWorkflowRejectForm().invalid()"
                  type="submit"
                  class="px-8 py-3 text-[11px] font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed">
            @if (isLoading()) {
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            } @else {
              Confirm Rejection
            }
          </button>
        </div>
      </form>
    </div>
  </div>
}`,
  styles: [`
    @keyframes zoomIn { from { opacity: 0; transform: scale(0.98) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .animate-in { animation: zoomIn 0.2s cubic-bezier(0, 0, 0.2, 1); }
  `]
})
export class RejectWorkflowStepStatusComponent {
  @Input() isOpen = signal(false);
  @Input() tasks!:TaskDTO[];
    @Input() workflowId!:number;  
    @Input() workflowStepId!:number;
  @Output() cancel = new EventEmitter<boolean>();
  isLoading = signal(false)
  constructor(private workflowService: WorkflowService){}
  updateWorkflowStepData= signal<UpdateWorkflowStepRequest>({
    taskId: null,
    message: '',
    stepStatus: WorkflowStepStatus.REJECTED
  });

  updateWorkflowRejectForm = form(this.updateWorkflowStepData, (schemaPath) => {
    required(schemaPath.taskId!, {message: "Task Name is required"}),
    required(schemaPath.message!, {message: "Message is required"})
   })

  private resetForm(): UpdateWorkflowStepRequest {
    return {
    taskId: null,
    message: '',
    stepStatus: WorkflowStepStatus.REJECTED
  };
  }

  onConfirm(): void {
     
      this.isLoading.update(v => !v);
    if(!this.updateWorkflowRejectForm().valid()) {
        //todo add toast
        this.isLoading.update(v => !v);
        return
    }
      
      this.workflowService.updateWorkflowStepStatus(this.workflowId,  this.workflowStepId,this.updateWorkflowStepData()).subscribe({
        next: (res) => {
           
               
                //TODO Add toast 
                this.workflowService.getWorkflowById(this.workflowId);
                this.isLoading.update(v => !v);
                this.isOpen.set(false)
 this.cancel.emit(true);
                
           
        },
        error: (err:HttpErrorResponse) => {
            //TODO add toast
                   toast.error("Error Updating Status", {description: err.error.error})
            this.isLoading.update(v => !v);
        }
      })

   

      // TODO sonnar error handling
 
  }

  onCancel(): void {
    this.cancel.emit(false);
    
    this.updateWorkflowStepData.set(this.resetForm())
    this.isOpen.set(false);
  }
}



