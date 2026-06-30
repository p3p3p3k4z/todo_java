import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { Task, TaskStatus } from '../models/task.model';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskListComponent]
    });
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty state when tasks array is empty', () => {
    component.tasks = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state')?.textContent).toContain('No tasks found');
  });

  it('should render task cards when tasks are provided', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1', status: TaskStatus.PENDIENTE },
      { id: 2, title: 'Task 2', status: TaskStatus.COMPLETADA }
    ];
    component.tasks = mockTasks;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('app-task-card');
    expect(cards.length).toBe(2);
  });
});
