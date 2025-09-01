import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { EintragComponent } from '../../components/eintrag/eintrag.component';
import { GetdataService, EintragData } from '../../services/getdata.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    EintragComponent,
  ],
})
export class DetailPage {
  eintrag?: EintragData;

  constructor(private route: ActivatedRoute, private getdata: GetdataService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const terminId = this.route.snapshot.paramMap.get('termin_id');

    if (id && terminId) {
      this.eintrag = this.getdata.data.find(
        (e) => e.id === id && e.termin_id === terminId
      );
    }
  }
}
