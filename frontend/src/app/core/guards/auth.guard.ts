import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege las rutas privadas verificando si el usuario ha iniciado sesion.
 * Si intentas entrar a la pantalla de "/tasks" pero este archivo detecta que no 
 * has iniciado sesion, te bloqueara el paso y te mandara de regreso al login.
 * 
 * Escribes manualmente 'localhost:4200/tasks' sin haber iniciado sesion. 
 * El Guard se da cuenta que no tienes Token e interrumpe la carga, enviandote a '/login'.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
