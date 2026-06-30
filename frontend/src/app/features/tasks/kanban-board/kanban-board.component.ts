import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LucideAngularModule, Clock, Settings, CheckCircle2, Edit2, Trash2 } from 'lucide-angular';
import { Task, TaskStatus } from '../models/task.model';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, LucideAngularModule],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnChanges {
  @Input() tasks: Task[] = [];
  @Output() updateStatus = new EventEmitter<{id: number, status: TaskStatus}>();

  // Columnas mapeadas localmente para Drag & Drop interactivo.
  pendingTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];

  readonly ClockIcon = Clock;
  readonly SettingsIcon = Settings;
  readonly CheckCircle2Icon = CheckCircle2;
  readonly EditIcon = Edit2;
  readonly TrashIcon = Trash2;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks'] && this.tasks) {
      // Reclasificacion estricta en base al estado persistente
      this.pendingTasks = this.tasks.filter(t => t.status === TaskStatus.PENDIENTE);
      this.inProgressTasks = this.tasks.filter(t => t.status === TaskStatus.EN_PROGRESO);
      this.completedTasks = this.tasks.filter(t => t.status === TaskStatus.COMPLETADA);
    }
  }

  /**
   * Logica de sincronizacion de CDK Drag & Drop.
   * Modifica instantaneamente el arreglo local para re-renderizado fluido y emite el evento para PATCH HTTP.
   */
  drop(event: CdkDragDrop<Task[]>, newStatus: string): void {
    if (event.previousContainer === event.container) {
      // Reordenamiento dentro de la misma columna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Mutacion entre columnas
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // El evento emite al TaskBoardComponent que orquesta la persistencia mediante TaskService
      const taskMutated = event.container.data[event.currentIndex];
      this.updateStatus.emit({ id: taskMutated.id!, status: newStatus as TaskStatus });
    }
  }
}
