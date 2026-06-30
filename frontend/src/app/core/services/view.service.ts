import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ViewMode = 'list' | 'sticky' | 'diagram' | 'kanban' | 'calendar';

/**
 * Gestiona el estado reactivo de la vista activa (Lista, Muro o Diagrama).
 * Expone un observable (viewMode$) al que los componentes se suscriben 
 * para renderizar dinamicamente el template sin refrescar la vista.
 */
@Injectable({
  providedIn: 'root'
})
export class ViewService {
  // BehaviorSubject almacena el ultimo valor emitido y lo inyecta a nuevos suscriptores de inmediato.
  private viewModeSubject = new BehaviorSubject<ViewMode>('list');
  
  // Exponemos el subject como un observable de solo lectura para evitar mutaciones externas.
  viewMode$ = this.viewModeSubject.asObservable();

  setViewMode(mode: ViewMode): void {
    // Al invocar next(), el BehaviorSubject empuja la cadena 'mode' a todos los componentes suscritos.
    this.viewModeSubject.next(mode);
  }
}
