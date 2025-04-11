import {Component, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

export interface DialogData {
  header: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-modal',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  readonly dialogRef = inject(MatDialogRef<ModalComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly title = signal(this.data.title);
  readonly description = signal(this.data.description);
  readonly task = signal({ title: this.title(), description: this.description()});

  protected onInputTitle(event: Event) {
    this.title.set((event.target as HTMLInputElement).value);
    this.task.set({ title: this.title(), description: this.description()});
  }
  protected onInputDescription(event: Event) {
    this.description.set((event.target as HTMLInputElement).value);
    this.task.set({ title: this.title(), description: this.description()});
  }
}

