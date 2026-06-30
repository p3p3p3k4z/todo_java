import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../models/task.model';
import { LucideAngularModule, Edit2, Check } from 'lucide-angular';

interface StickyNote extends Task {
  rotation: number;
  bgColor: string;
  textColor: string;
}

const BRAND_COLORS = [
  '#8C1D40',
  '#D81B60',
  '#00897B',
  '#3949AB',
  '#FBC02D',
  '#43A047',
  '#F4511E'
];

@Component({
  selector: 'app-sticky-board',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sticky-board.component.html',
  styleUrls: ['./sticky-board.component.scss']
})
export class StickyBoardComponent implements OnChanges {
  @Input() tasks: Task[] = [];
  @Output() editTask = new EventEmitter<Task>();
  @Output() updateStatus = new EventEmitter<{id: number, status: TaskStatus}>();

  stickyNotes: StickyNote[] = [];

  readonly EditIcon = Edit2;
  readonly CheckIcon = Check;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      // Extraccion de la copia actual mutada.
      const newTasks = changes['tasks'].currentValue as Task[];
      
      this.stickyNotes = newTasks.map(t => {
        // Busqueda secuencial para preservar el estado visual de rotacion de nodos existentes.
        const existing = this.stickyNotes.find(sn => sn.id === t.id);
        if (existing) {
          return { 
            ...t, 
            rotation: existing.rotation, 
            bgColor: existing.bgColor,
            textColor: existing.textColor
          };
        }
        
        // Seed aleatoria de rotacion en eje Z (-5 a 5 grados) para nodos entrantes.
        const rotation = Math.random() * 10 - 5;
        const bgColor = this.getRandomBrandColor();
        const textColor = this.getContrastTextColor(bgColor);

        return { ...t, rotation, bgColor, textColor };
      });
    }
  }

  /**
   * Retorna un color aleatorio estrictamente de la paleta institucional.
   */
  private getRandomBrandColor(): string {
    const randomIndex = Math.floor(Math.random() * BRAND_COLORS.length);
    return BRAND_COLORS[randomIndex];
  }

  /**
   * Algoritmo de luminancia (Luma) para determinar contraste accesible.
   * Retorna blanco para colores oscuros y gris casi negro para colores claros.
   */
  private getContrastTextColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Formula Luma (Rec. 601)
    const luma = (r * 299 + g * 587 + b * 114) / 1000;
    
    return luma > 128 ? '#111111' : '#FFFFFF';
  }

  completeTask(note: StickyNote): void {
    if (note.status === TaskStatus.COMPLETADA) return;
    this.updateStatus.emit({ id: note.id!, status: TaskStatus.COMPLETADA });
  }

  onEdit(note: StickyNote): void {
    const { rotation, bgColor, textColor, ...task } = note;
    this.editTask.emit(task);
  }
}
