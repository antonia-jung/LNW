import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { GetdataService } from '../services/getdata.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ExploreContainerComponentModule],
})
export class Tab2Page {
  constructor(public getdata: GetdataService, private router: Router) {}

  trackById(_: number, item: { id: string; termin_id: string }) {
    return `${item.id}-${item.termin_id}`;
  }

  openDetail(item: { id: string; termin_id: string }) {
    this.router.navigate(['/detail', item.id, item.termin_id]);
  }
  goImpressum() {
    // absolute Navigation zur Standalone-Seite
    this.router.navigateByUrl('/impressum', { replaceUrl: false });
  }
}
