import { Component, Input } from '@angular/core';
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

  edit(event: Event): any {
    console.log('edit', event);
  }
  delete(): any {
    console.log('delete');
  }
  onClick(event: Event): any {
    console.log('event', event);
  }
}
