import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  model,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { Subscription } from 'rxjs';
import { Task } from './interfaces/task.interfaces';

interface EventArg {
  id: number;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ListComponent,
    HeaderComponent,
    FooterComponent,
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
  private storageSubscription: Subscription;

  taskList: Task[] = [];
  title = 'Task tracker';
  count = 0;

  constructor(private localeStore: LocalService, private ref: ChangeDetectorRef) {
    this.storageSubscription = this.localeStore.storage$.subscribe((taskList) => {
      console.log('taskList', taskList);
      if (taskList) {
        this.taskList = JSON.parse(taskList);
      }
      console.log('ThistaskList', this.taskList);
    });
  }

  readonly description = signal('');
  readonly titleModel = model('');
  readonly dialog = inject(MatDialog);

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        header: 'Add new task',
        title: this.titleModel(),
        description: this.description(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        const task = {
          name: result.title,
          description: result.description,
          id: this.count,
        };

        this.count++;
        this.taskList = [...this.taskList, task];
        this.localeStore.saveData('taskList', JSON.stringify(this.taskList));
        this.ref.detectChanges();
      }
    });
  }

  openEditDialog(eventArg: EventArg): void {
    const itemEditIndex = this.taskList.findIndex((item) => item.id === eventArg.id);
    const itemEdit = this.taskList.find((item) => item.id === eventArg.id);
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        header: 'Edit task',
        title: itemEdit?.name,
        description: itemEdit?.description,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        const task = {
          name: result.title,
          description: result.description,
          id: this.count,
        };

        this.count++;
        this.taskList.splice(itemEditIndex, 1, task);
        this.localeStore.saveData('taskList', JSON.stringify(this.taskList));
        this.ref.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.taskList = tasks;
    this.count = tasks.length;
    this.localeStore.saveData('taskList', JSON.stringify(this.taskList));
  }
  ngOnDestroy(): void {
    this.localeStore.removeData('taskList');
    this.storageSubscription.unsubscribe();
  }

  onDeleteTask(eventArg: EventArg) {
    const index = this.taskList.findIndex((item) => item.id === eventArg.id);
    this.taskList.splice(index, 1);
    this.localeStore.saveData('taskList', JSON.stringify(this.taskList));
  }
}
