import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { taskList } from '../data.json';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'toDoList';
  taskList = taskList;
}
