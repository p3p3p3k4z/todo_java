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
        // Se inyecta la carga util en la cache; la UI repinta automaticamente.
        this.tasksSubject.next(tasks);
      },
      error: (err) => console.error('Error loading tasks', err)
    });
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
        // Extraemos la instantanea actual del array en memoria.
        const currentTasks = this.tasksSubject.value;
        // Empujamos el nuevo array agregando el objeto recién creado.
        this.tasksSubject.next([...currentTasks, newTask]);
      })
    );
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${id}`, task).pipe(
      tap((updatedTask) => {
        const currentTasks = this.tasksSubject.value;
        // Buscamos el indice del elemento mutado en cache.
        const index = currentTasks.findIndex(t => t.id === id);
        if (index !== -1) {
          // Reemplazamos el nodo en memoria y disparamos notificacion a los suscriptores.
          currentTasks[index] = updatedTask;
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
