import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';

/**
 * Define las rutas de navegacion de la aplicacion.
 * Por ejemplo, si escribe "/login", lo mandamos a la pantalla de Login. Si intenta ir 
 * a "/tasks", le aplicamos la seguridad del 'authGuard' antes de dejarlo pasar.
 * 
 * Un usuario escribe 'tusitio.com/registro'. Angular lee este archivo, ve que 
 * '/registro' esta asociado al componente 'RegisterComponent', y lo dibuja en pantalla.
 */
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks', loadComponent: () => import('./features/tasks/task-board/task-board.component').then(m => m.TaskBoardComponent), canActivate: [authGuard] },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
