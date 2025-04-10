import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { Task } from '../../interfaces/task.interfaces';

@Component({
  selector: 'app-list',
  imports: [MatListModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  @Input() taskList?: Task[];

  @Output() editTask: EventEmitter<any> = new EventEmitter();
  @Output() deleteTask: EventEmitter<any> = new EventEmitter();

  edit(task: Task): void {
    this.editTask.emit({id: task.id});
  }
  delete(task: Task): void {
    // console.log('task', task);
    this.deleteTask.emit({id: task.id});
  }
  onClick(): any {
  
  }
}
