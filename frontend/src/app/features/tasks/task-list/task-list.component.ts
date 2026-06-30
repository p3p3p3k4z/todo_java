import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

/**
 * Se encarga unicamente de dibujar la lista de tareas en pantalla.
 * No se conecta a internet ni pide datos; simplemente recibe una lista 
 * de tareas que el TaskBoard le paso y las muestra en la interfaz.
 * 
 * El TaskBoard le envia 5 tareas. Este componente simplemente hace un 'for' 
 * (en el HTML) y dibuja 5 cuadritos (TaskCards) en la pantalla.
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  template: `
    <div class="task-list">
      <div *ngIf="tasks.length === 0" class="empty-state">
        No tasks found.
      </div>
      <app-task-card
        *ngFor="let task of tasks"
        [task]="task"
        [isBoardMode]="false"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (statusChange)="onStatusChange($event)">
      </app-task-card>
    </div>
  `,
  styles: [`
    .task-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--color-text-muted);
      background: var(--color-bg-surface);
      border-radius: 8px;
    }
  `]
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<number>();
  @Output() updateStatus = new EventEmitter<{id: number, status: TaskStatus}>();

  onEdit(task: Task) {
    this.editTask.emit(task);
  }

  onDelete(id: number) {
    this.deleteTask.emit(id);
  }

  onStatusChange(event: {id: number, status: TaskStatus}) {
    this.updateStatus.emit(event);
  }
}
