import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API_URL);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.API_URL, task);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
