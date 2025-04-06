import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { taskList as tasks } from '../data.json';

import { LocalService } from '../services/local.service';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'toDoList';
  taskList: any[] = [];
  count = 0;

  constructor(private localeStore: LocalService) {}

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
  updateTask(event:any, index: number, taskNew: any) {
    this.taskList.splice(index, 1, taskNew);
    this.localeStore.saveData('taskList', JSON.stringify(this.taskList));
  }
  deleteTask(event: any, index: number) {
    this.taskList.splice(index, 1);
    this.localeStore.saveData('taskList', JSON.stringify(this.taskList));
  }
}
