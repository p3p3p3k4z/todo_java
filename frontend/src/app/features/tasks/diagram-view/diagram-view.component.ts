import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../models/task.model';
import { LucideAngularModule, Briefcase, Users, Monitor, Server, Share2, HelpCircle } from 'lucide-angular';

interface DiagramGroup {
  role: string;
  tasks: Task[];
  colorVar: string;
  icon: any;
}

@Component({
  selector: 'app-diagram-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './diagram-view.component.html',
  styleUrls: ['./diagram-view.component.scss']
})
export class DiagramViewComponent implements OnChanges {
  @Input() tasks: Task[] = [];
  
  diagramGroups: DiagramGroup[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      this.generateGroups();
    }
  }

  generateGroups(): void {
    // Inicializamos arrays independientes por cada cluster esperado.
    const pm: Task[] = [];
    const devops: Task[] = [];
    const sysadmin: Task[] = [];
    const dev: Task[] = [];
    const shared: Task[] = [];
    const unassigned: Task[] = [];

    // Algoritmo de multiplexado O(N) para particionar las tareas.
    this.tasks.forEach(task => {
      if (!task.roles || task.roles.length === 0) {
        // Tareas huerfanas sin rol asigando caen en un bucket neutral.
        unassigned.push(task);
      } else if (task.roles.length > 1) {
        // Tareas con multiplicidad de roles entran en bloque de colaboración.
        shared.push(task);
      } else {
        // Extracción de string para evitar fallos por capitalización.
        const r = task.roles[0].toUpperCase();
        if (r.includes('PM') || r.includes('PROJECT MANAGER')) pm.push(task);
        else if (r.includes('DEVOPS')) devops.push(task);
        else if (r.includes('SYSADMIN')) sysadmin.push(task);
        else if (r.includes('DEV')) dev.push(task);
        else unassigned.push(task);
      }
    });

    // Mapeo final al array de renderizado asociando las variables CSS de color.
    this.diagramGroups = [
      { role: 'Project Manager', tasks: pm, colorVar: 'var(--color-brand-guinda)', icon: Briefcase },
      { role: 'DevOps', tasks: devops, colorVar: 'var(--color-brand-teal)', icon: Server },
      { role: 'SysAdmin', tasks: sysadmin, colorVar: 'var(--color-brand-indigo)', icon: Monitor },
      { role: 'Developer', tasks: dev, colorVar: 'var(--color-brand-magenta)', icon: Users },
      { role: 'Shared / Colaboracion', tasks: shared, colorVar: 'var(--color-brand-yellow)', icon: Share2 }
    ];

    if (unassigned.length > 0) {
      this.diagramGroups.push({ role: 'Sin Asignar', tasks: unassigned, colorVar: 'var(--color-text-muted)', icon: HelpCircle });
    }
  }
}
