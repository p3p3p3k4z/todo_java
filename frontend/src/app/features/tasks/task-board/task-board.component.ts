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

/**
 * Controla la vista principal donde se agrupan y muestran las tareas del usuario.
 * Carga los datos usando el TaskService, controla si 
 * se muestra el recuadro de "Cargando", y decide que lista de tareas mostrarte.
 * 
 * Entras a la app, este componente arranca, le pide las tareas al TaskService, 
 * y luego le pasa esas tareas al 'task-list' para que las dibuje.
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
    ErrorBannerComponent
  ],
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  
  isLoading: boolean = false;
  errorMessage: string = '';
  
  isBoardMode: boolean = false;
  showForm: boolean = false;
  taskToEdit: Task | null = null;
  
  statusFilter = new FormControl('');

  TaskStatus = TaskStatus;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.statusFilter.valueChanges.subscribe(value => {
      this.applyFilter(value);
    });
  }

  loadTasks() {
    this.isLoading = true;
    this.errorMessage = '';
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilter(this.statusFilter.value);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load tasks. Please try again.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(status: string | null) {
    if (!status) {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(t => t.status === status);
    }
  }

  toggleViewMode() {
    this.isBoardMode = !this.isBoardMode;
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
          this.loadTasks();
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
          this.loadTasks();
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
        this.loadTasks();
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
