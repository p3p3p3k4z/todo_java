import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';

/**
 * Intercepta las peticiones salientes para incluir el token de seguridad.
 * Antes de que la peticion salga a internet, este archivo la detiene, busca si tienes 
 * un token guardado, y si lo tienes, se lo pega a la peticion como una estampa de 
 * "Autorizado". Asi no tienes que hacer esto manualmente en cada llamada.
 * 
 * Tu intentas pedir la lista de tareas. El navegador quiere mandar un GET pelon, 
 * pero este archivo lo intercepta y le inyecta 'Authorization: Bearer <tu_token>'.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const token = tokenStorage.getToken();

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  return next(req);
};
