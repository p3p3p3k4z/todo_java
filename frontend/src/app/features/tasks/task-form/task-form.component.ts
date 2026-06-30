import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskStatus } from '../models/task.model';
import { LucideAngularModule, Save, X } from 'lucide-angular';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnChanges {
  @Input() taskToEdit: Task | null = null;
  @Output() save = new EventEmitter<{task: Task, file?: File}>();
  @Output() cancel = new EventEmitter<void>();

  selectedFile?: File;

  taskForm: FormGroup;
  TaskStatus = TaskStatus;
  
  readonly SaveIcon = Save;
  readonly CancelIcon = X;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: [TaskStatus.PENDIENTE, Validators.required],
      dueDate: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.taskForm.patchValue({
        title: this.taskToEdit.title,
        description: this.taskToEdit.description,
        status: this.taskToEdit.status,
        dueDate: this.taskToEdit.dueDate || ''
      });
    } else if (!this.taskToEdit) {
      this.taskForm.reset({ status: TaskStatus.PENDIENTE });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const formValue = this.taskForm.value;
    const task: Task = {
      ...formValue,
      id: this.taskToEdit?.id
    };
    this.save.emit({ task, file: this.selectedFile });
    this.selectedFile = undefined;
  }

  onCancel() {
    this.selectedFile = undefined;
    this.cancel.emit();
    this.taskForm.reset({ status: TaskStatus.PENDIENTE });
  }
}
