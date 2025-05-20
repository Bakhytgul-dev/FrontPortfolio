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

  value: Task[] = [];
  title = 'Task tracker';
  count = 0;

  constructor(private localeStore: LocalService) {
    this.storageSubscription = this.localeStore.storage$.subscribe((value) => {
      console.log('value', value);
      if (value) {
        this.value = JSON.parse(value);
      }
      console.log('Thisvalue', this.value);
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
        this.value = [...this.value, task];
        this.localeStore.saveData('value', JSON.stringify(this.value));
      }
    });
  }

  openEditDialog(eventArg: EventArg): void {
    const itemEditIndex = this.value.findIndex((item) => item.id === eventArg.id);
    const itemEdit = this.value.find((item) => item.id === eventArg.id);
    console.log('numEdit', itemEdit);
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        header: 'Edit task',
        title: itemEdit?.name,
        description: itemEdit?.description,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        const task = {
          name: result.title,
          description: result.description,
          id: this.count,
        };

        this.count++;
        this.value.splice(itemEditIndex, 1, task);
        this.localeStore.saveData('value', JSON.stringify(this.value));
      }
    });
  }

  ngOnInit(): void {
    this.value = tasks;
    this.count = tasks.length;
    this.localeStore.saveData('value', JSON.stringify(this.value));
  }
  ngOnDestroy(): void {
    this.localeStore.removeData('value');
    this.storageSubscription.unsubscribe();
  }

  onEditTask(eventArg: EventArg) {
    const index = this.value.findIndex((item) => item.id === eventArg.id);
    this.value.splice(index, 1, { name: 'Task45', id: 89, description: '' });
    this.localeStore.saveData('value', JSON.stringify(this.value));
    console.log('numEdit', index);
  }

  onDeleteTask(eventArg: EventArg) {
    const index = this.value.findIndex((item) => item.id === eventArg.id);
    this.value.splice(index, 1);
    this.localeStore.saveData('value', JSON.stringify(this.value));
  }
}
