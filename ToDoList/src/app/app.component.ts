import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  model,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { taskList as tasks } from '../data.json';

import { LocalService } from '../services/local.service';

import { ModalComponent } from './components/modal/modal.component';
import { ListComponent } from './components/list/list.component';

interface EventArg {
  id: number,
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ListComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'toDoList';
  taskList: any[] = [];
  count = 0;

  constructor(private localeStore: LocalService) {}

  readonly description = signal('');
  readonly titleModel = model('');
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { header: 'Add new task', title: this.titleModel(), description: this.description() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        //this.animal.set(result);
      }
    });
  }

  ngOnInit(): void {
    this.taskList = tasks;
    this.count = tasks.length;
    this.localeStore.saveData('taskList', JSON.stringify(this.taskList));
  }
  ngOnDestroy(): void {
    //this.localeStore.removeData('taskList');
  }

  addTask() {
    this.count = this.count + 1;
    const task = { name: 'Task' + this.count, id: this.count };

    this.taskList = [...this.taskList, task];
    this.localeStore.saveData('taskList', JSON.stringify(this.taskList));
  }

  onEditTask(eventArg: EventArg) {
    const index = this.taskList.findIndex(item=> item.id === eventArg.id);
    this.taskList.splice(index, 1, { name: 'Task45', id: 89});
    this.localeStore.saveData('taskList', JSON.stringify(this.taskList));
    console.log('numEdit', index);
  }

  onDeleteTask(eventArg: EventArg) {
    const index = this.taskList.findIndex(item=> item.id === eventArg.id);
    this.taskList.splice(index, 1);
    this.localeStore.saveData('taskList', JSON.stringify(this.taskList));
  }
}
