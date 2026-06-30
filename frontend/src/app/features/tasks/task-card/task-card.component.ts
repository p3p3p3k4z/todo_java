import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../models/task.model';
import { LucideAngularModule, Edit2, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() isBoardMode: boolean = false;
  
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<{id: number, status: TaskStatus}>();

  readonly EditIcon = Edit2;
  readonly TrashIcon = Trash2;

  TaskStatus = TaskStatus;

  onEdit() {
    this.edit.emit(this.task);
  }

  onDelete() {
    if (this.task.id && confirm('Are you sure you want to delete this task?')) {
      this.delete.emit(this.task.id);
    }
  }

  onStatusChange(event: any) {
    if (this.task.id) {
      this.statusChange.emit({ id: this.task.id, status: event.target.value as TaskStatus });
    }
  }
}
