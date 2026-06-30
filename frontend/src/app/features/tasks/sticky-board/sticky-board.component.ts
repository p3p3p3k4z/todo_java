import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../models/task.model';

interface StickyNote extends Task {
  rotation: number;
  isFalling: boolean;
}

@Component({
  selector: 'app-sticky-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sticky-board.component.html',
  styleUrls: ['./sticky-board.component.scss']
})
export class StickyBoardComponent implements OnChanges {
  @Input() tasks: Task[] = [];
  @Output() editTask = new EventEmitter<Task>();
  @Output() updateStatus = new EventEmitter<{id: number, status: TaskStatus}>();

  stickyNotes: StickyNote[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      // Extraccion de la copia actual mutada.
      const newTasks = changes['tasks'].currentValue as Task[];
      
      this.stickyNotes = newTasks.map(t => {
        // Busqueda secuencial para preservar el estado visual de rotacion de nodos existentes.
        const existing = this.stickyNotes.find(sn => sn.id === t.id);
        if (existing) {
          return { ...t, rotation: existing.rotation, isFalling: existing.isFalling };
        }
        
        // Seed aleatoria de rotacion en eje Z (-5 a 5 grados) para nodos entrantes.
        const rotation = Math.random() * 10 - 5;
        return { ...t, rotation, isFalling: false };
      });
    }
  }

  completeTask(note: StickyNote): void {
    // Bloqueo de ejecucion dual.
    if (note.status === TaskStatus.COMPLETADA) return;
    
    // Bandera local inyectada para detonar frame CSS keyframes .falling
    note.isFalling = true;
    
    // Bloqueo asincrono de 800ms para empatar con duracion del cubic-bezier CSS
    // previo a notificar emision de estado al padre.
    setTimeout(() => {
      this.updateStatus.emit({ id: note.id!, status: TaskStatus.COMPLETADA });
    }, 800);
  }

  onEdit(note: StickyNote): void {
    const { rotation, isFalling, ...task } = note;
    this.editTask.emit(task);
  }
}
