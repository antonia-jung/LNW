import { Component } from '@angular/core';
import { GetdataService } from '../services/getdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  constructor(public getdataservice: GetdataService, private router: Router) {}

  goImpressum() {
    // absolute Navigation zur Standalone-Seite
    this.router.navigateByUrl('/impressum', { replaceUrl: false });
  }
}
