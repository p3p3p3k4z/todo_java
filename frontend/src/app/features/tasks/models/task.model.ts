export enum TaskStatus {
  PENDIENTE = 'PENDIENTE',
  EN_PROGRESO = 'EN_PROGRESO',
  COMPLETADA = 'COMPLETADA'
}

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string; // YYYY-MM-DD
  roles?: string[]; // PM, DevOps, SysAdmin, Developer
}
