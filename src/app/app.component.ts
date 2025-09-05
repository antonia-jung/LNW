import { Component } from '@angular/core';
import { GetdataService } from './services/getdata.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(public getDataService: GetdataService) {}
}
