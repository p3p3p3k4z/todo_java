import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ErrorBannerComponent } from '../../../shared/components/error-banner/error-banner.component';
import { ViewService, ViewMode } from '../../../core/services/view.service';
import { StickyBoardComponent } from '../sticky-board/sticky-board.component';
import { DiagramViewComponent } from '../diagram-view/diagram-view.component';

/**
 * Contenedor orquestador. Inyecta sub-vistas dependiendo del estado emitido por ViewService.
 */
@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    TaskListComponent, 
    TaskFormComponent, 
    TaskCardComponent,
    SpinnerComponent,
    ErrorBannerComponent,
    StickyBoardComponent,
    DiagramViewComponent
  ],
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  
  isLoading: boolean = false;
  errorMessage: string = '';
  
  activeView: ViewMode = 'list';
  showForm: boolean = false;
  taskToEdit: Task | null = null;
  
  statusFilter = new FormControl('');

  TaskStatus = TaskStatus;

  constructor(private taskService: TaskService, private viewService: ViewService) {}

  ngOnInit(): void {
    // Sincronizacion inicial del ViewMode inyectado desde SidebarComponent.
    this.viewService.viewMode$.subscribe(mode => {
      this.activeView = mode;
    });

    // Enlace reactivo al estado global de tareas (Cache en TaskService).
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilter(this.statusFilter.value);
      this.isLoading = false;
    });

    // Suscripcion al filtro local reactivo (FormControl)
    this.statusFilter.valueChanges.subscribe(value => {
      this.applyFilter(value);
    });

    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.errorMessage = '';
    this.taskService.loadTasks();
  }

  applyFilter(status: string | null) {
    if (!status) {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(t => t.status === status);
    }
  }

  openNewTaskForm() {
    this.taskToEdit = null;
    this.showForm = true;
  }

  openEditForm(task: Task) {
    this.taskToEdit = task;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.taskToEdit = null;
  }

  saveTask(task: Task) {
    this.isLoading = true;
    if (task.id) {
      this.taskService.updateTask(task.id, task).subscribe({
        next: () => {
          this.closeForm();
        },
        error: () => {
          this.errorMessage = 'Failed to update task.';
          this.isLoading = false;
        }
      });
    } else {
      this.taskService.createTask(task).subscribe({
        next: () => {
          this.closeForm();
        },
        error: () => {
          this.errorMessage = 'Failed to create task.';
          this.isLoading = false;
        }
      });
    }
  }

  deleteTask(id: number) {
    this.isLoading = true;
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        // UI updates automatically via subject
      },
      error: () => {
        this.errorMessage = 'Failed to delete task.';
        this.isLoading = false;
      }
    });
  }

  updateTaskStatus(event: {id: number, status: TaskStatus}) {
    const task = this.tasks.find(t => t.id === event.id);
    if (task) {
      const updatedTask = { ...task, status: event.status };
      this.saveTask(updatedTask);
    }
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.filteredTasks.filter(t => t.status === status);
  }
}
