import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, AlertCircle } from 'lucide-angular';
import { Task, TaskStatus } from '../models/task.model';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

@Component({
  selector: 'app-calendar-board',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './calendar-board.component.html',
  styleUrls: ['./calendar-board.component.scss']
})
export class CalendarBoardComponent implements OnChanges {
  @Input() tasks: Task[] = [];
  @Output() editTask = new EventEmitter<Task>();

  calendarDays: CalendarDay[] = [];
  currentDate: Date = new Date();
  
  currentMonthName: string = '';
  currentYear: number = 0;

  selectedDay: CalendarDay | null = null;

  readonly CalendarIcon = Calendar;
  readonly AlertIcon = AlertCircle;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      this.buildCalendar();
    }
  }

  buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    this.currentYear = year;
    this.currentMonthName = new Date(year, month).toLocaleString('es-ES', { month: 'long' });

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start on Sunday

    const endDate = new Date(lastDayOfMonth);
    if (endDate.getDay() !== 6) {
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday
    }

    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    const today = new Date();
    today.setHours(0,0,0,0);

    while (current <= endDate) {
      const isCurrentMonth = current.getMonth() === month;
      const isToday = current.getTime() === today.getTime();
      
      const dayTasks = this.tasks.filter(t => {
        if (!t.dueDate) return false;
        // Parse "YYYY-MM-DD" safely relative to local timezone
        const parts = t.dueDate.split('-');
        if (parts.length === 3) {
          const tDate = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
          return tDate.getTime() === current.getTime();
        }
        return false;
      });

      days.push({
        date: new Date(current),
        isCurrentMonth,
        isToday,
        tasks: dayTasks
      });
      current.setDate(current.getDate() + 1);
    }
    
    this.calendarDays = days;
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.buildCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.buildCalendar();
  }

  openDayTasks(day: CalendarDay) {
    if (day.tasks.length > 0) {
      this.selectedDay = day;
    }
  }

  closeDayTasks() {
    this.selectedDay = null;
  }
}
