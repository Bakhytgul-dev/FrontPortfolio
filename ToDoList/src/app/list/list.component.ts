import { Component } from '@angular/core';
import { MatListModule} from '@angular/material/list';


@Component({
  selector: 'app-list',
  imports: [MatListModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
}
