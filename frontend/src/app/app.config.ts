import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { routes } from './app.routes';

/**
 * Configura los servicios base de Angular, como las rutas y los interceptores HTTP.
 * Habilita el sistema de rutas y utiliza nuestro interceptor de JWT.
 * 
 * Cuando Angular arranca por primera vez, lee este archivo para saber con que 
 * "poderes" iniciar (ej. el poder de rutear paginas y de enviar llamadas HTTP con tokens).
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
};

