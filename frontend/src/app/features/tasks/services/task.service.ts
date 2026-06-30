import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task } from '../models/task.model';

/**
 * Centraliza las peticiones al backend para consultar o modificar tareas.
 * Los componentes visuales (las pantallas) le dicen a este archivo: "Traeme las tareas", 
 * y este archivo es el que se conecta con la URL del backend para traer los datos reales.
 * 
 * El TaskBoardComponent quiere mostrar tus tareas. Llama a 'taskService.getTasks()', 
 * este servicio hace un GET a 'http://localhost:8080/api/tasks' y devuelve los datos limpios.
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
        // Filtramos eliminando el ID objetivo de la cache.
        const currentTasks = this.tasksSubject.value.filter(t => t.id !== id);
        this.tasksSubject.next(currentTasks);
      })
    );
  }
}
