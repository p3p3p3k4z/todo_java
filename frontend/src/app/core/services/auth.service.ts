import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

/**
 * Gestiona la comunicacion con el backend para el inicio de sesion y registro.
 * Manda los datos por internet y si todo sale bien, 
 * guarda el token recibido en la memoria del navegador usando el TokenStorageService.
 * 
 * Cuando le das click a "Ingresar", el boton llama a 'login(email, password)' en este archivo.
 * Si la contraseña es correcta, este archivo toma el Token de la respuesta y lo guarda.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth';

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.tokenStorage.saveToken(response.token);
        }
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, user).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.tokenStorage.saveToken(response.token);
        }
      })
    );
  }

  logout(): void {
    this.tokenStorage.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.tokenStorage.getToken();
  }
}
