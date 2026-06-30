import { Injectable } from '@angular/core';

/**
 * Capa de persistencia local para claves JWT via LocalStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly TOKEN_KEY = 'auth-token';

  constructor() { }

  public saveToken(token: string): void {
    window.localStorage.removeItem(this.TOKEN_KEY); // Purga defensiva previo a inyeccion.
    window.localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(this.TOKEN_KEY);
  }

  public clearToken(): void {
    window.localStorage.removeItem(this.TOKEN_KEY);
  }
}
