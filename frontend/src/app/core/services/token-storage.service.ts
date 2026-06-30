import { Injectable } from '@angular/core';

/**
 * Administra el almacenamiento local del token en el navegador.
 * Guarda, lee o borra la llave de acceso dentro de la memoria interna (LocalStorage). 
 * Asi no tienes 
 * que iniciar sesion cada vez que recargas la pagina.
 * 
 * Al hacer Logout, otro archivo llama a 'clearToken()' aqui, lo que borra la 
 * llave de acceso de tu navegador y te obliga a iniciar sesion de nuevo.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly TOKEN_KEY = 'auth-token';

  constructor() { }

  public saveToken(token: string): void {
    window.localStorage.removeItem(this.TOKEN_KEY);
    window.localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(this.TOKEN_KEY);
  }

  public clearToken(): void {
    window.localStorage.removeItem(this.TOKEN_KEY);
  }
}
