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
import { v4 as uuidv4 } from 'uuid';
import { Subscription } from 'rxjs';
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
import { Task } from './interfaces/task.interfaces';
import { EventArg } from './interfaces/event.interface';
import { TITLE, TITLE_MODAL_ADD, TITLE_MODAL_EDIT } from './constants';

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
  title = TITLE;

  constructor(
    private localeStore: LocalService,
    private ref: ChangeDetectorRef
  ) {
    this.storageSubscription = this.localeStore.storage$.subscribe(
      (valueStor) => {
        this.taskList = valueStor && JSON.parse(valueStor);
      }
    );
  }

  readonly description = signal('');
  readonly titleModel = model('');
  readonly dialog = inject(MatDialog);

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        header: TITLE_MODAL_ADD,
        title: this.titleModel(),
        description: this.description(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.taskList.push({
          name: result.title,
          description: result.description,
          id: uuidv4(),
        });
        this.localeStore.saveData('taskList', JSON.stringify(this.taskList));
        this.ref.detectChanges();
      }
    });
  }

  openEditDialog(eventArg: EventArg): void {
    const itemEditIndex = this.taskList.findIndex(
      (item) => item.id === eventArg.id
    );
    const itemEdit = this.taskList.find((item) => item.id === eventArg.id);
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        header: TITLE_MODAL_EDIT,
        title: itemEdit?.name,
        description: itemEdit?.description,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.taskList.splice(itemEditIndex, 1, {
          name: result.title,
          description: result.description,
          id: eventArg.id,
        });
        this.localeStore.saveData('taskList', JSON.stringify(this.taskList));
        this.ref.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.taskList = tasks;
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
