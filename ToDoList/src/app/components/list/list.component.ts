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

  edit(): any {
    this.editTask.emit(1);
  }
  delete(): any {
    this.deleteTask.emit(1);
  }
  onClick(): any {
  
  }
}
