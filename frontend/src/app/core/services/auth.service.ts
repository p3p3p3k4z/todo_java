import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

/**
 * Gestiona autenticacion contra la API y delegacion de persistencia de tokens.
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
        // Intercepcion reactiva para almacenar en local storage si el servidor emite token.
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
