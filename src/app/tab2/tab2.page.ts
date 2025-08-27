import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { GetdataService } from '../services/getdata.service';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ExploreContainerComponentModule],
})
export class Tab2Page {
  constructor(public getdata: GetdataService) {}

  trackById(_: number, item: { id: string; termin_id: string }) {
    return `${item.id}-${item.termin_id}`;
  }
}
