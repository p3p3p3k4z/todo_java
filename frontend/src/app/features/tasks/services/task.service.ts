import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task } from '../models/task.model';

/**
 * Servicio Singleton central para interaccion REST con el backend y orquestacion reactiva del estado.
 * Implementa el patron Single Source of Truth mediante BehaviorSubject.
 * Las vistas inyectan este servicio y se suscriben a tasks$ para reaccionar a mutaciones del modelo en tiempo real.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = '/api/tasks';
  
  // Cache reactiva en memoria. Inicia con array vacio.
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) { }

  loadTasks(): void {
    // Peticion asincrona al backend.
    this.http.get<Task[]>(this.API_URL).subscribe({
      next: (tasks) => {
        const mappedTasks = this.mapTasks(tasks);
        // Se inyecta la carga util en la cache; la UI repinta automaticamente.
        this.tasksSubject.next(mappedTasks);
      },
      error: (err) => console.error('Error loading tasks', err)
    });
  }

  private mapTasks(tasks: Task[]): Task[] {
    return tasks.map(task => this.mapSingleTask(task));
  }

  private mapSingleTask(task: Task): Task {
    let roles: string[] = [];
    if (task.assigneeEmails) {
      roles = task.assigneeEmails.map(email => {
        const e = email.toUpperCase();
        if (e.includes('PM')) return 'Project Manager';
        if (e.includes('DEVOPS')) return 'DevOps';
        if (e.includes('DATA') || e.includes('MACHINELEARNING')) return 'SysAdmin';
        return 'Developer';
      });
    }
    return { ...task, roles };
  }


  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API_URL);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.API_URL, task).pipe(
      tap((newTask) => {
        const mappedTask = this.mapSingleTask(newTask);
        // Snapshot of the current in-memory array before appending.
        const currentTasks = this.tasksSubject.value;
        // Pushes new task into the in-memory cache and notifies all subscribers.
        this.tasksSubject.next([...currentTasks, mappedTask]);
      })
    );
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${id}`, task).pipe(
      tap((updatedTask) => {
        const mappedTask = this.mapSingleTask(updatedTask);
        const currentTasks = this.tasksSubject.value;
        // Locate the mutated element index in the in-memory cache.
        const index = currentTasks.findIndex(t => t.id === id);
        if (index !== -1) {
          // Replaces the node in memory and triggers notification to all subscribers.
          currentTasks[index] = mappedTask;
          this.tasksSubject.next([...currentTasks]);
        }
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.loadTasks();
      })
    );
  }

  /**
   * Sube un archivo adjunto a una tarea existente.
   * Utiliza FormData para el content-type multipart/form-data.
   */
  uploadAttachment(taskId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.API_URL}/${taskId}/attachments`, formData).pipe(
      tap(() => {
        // Refrescamos la fuente de verdad (Single Source of Truth) para obtener la tarea
        // con su nuevo arreglo de adjuntos actualizado desde el backend.
        this.loadTasks();
      })
    );
  }
}
