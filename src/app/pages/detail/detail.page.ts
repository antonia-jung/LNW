import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { GetdataService, EintragData } from '../../services/getdata.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    // Header/Toolbar
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    // Liste/Items
    IonList,
    IonItem,
    IonLabel,
  ],
})
export class DetailPage {
  private loadingSig = signal<boolean>(true);
  private entrySig = signal<EintragData | null>(null);

  constructor(
    private route: ActivatedRoute,
    public getdata: GetdataService,
    private nav: NavController
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const terminId = this.route.snapshot.paramMap.get('termin_id');

    if (
      !this.getdata.data?.length &&
      typeof (this.getdata as any).loadData === 'function'
    ) {
      try {
        await (this.getdata as any).loadData();
      } catch {
        // ignorieren
      }
    }

    if (id && terminId) {
      const found =
        this.getdata.data?.find(
          (e: EintragData) => e.id === id && e.termin_id === terminId
        ) ?? null;
      this.entrySig.set(found);
    } else {
      this.entrySig.set(null);
    }

    this.loadingSig.set(false);
  }

  back() {
    this.nav.back();
  }

  isLoading(): boolean {
    return this.loadingSig();
  }

  entry(): EintragData | null {
    return this.entrySig();
  }

  isFav(): boolean {
    const e = this.entrySig();
    if (!e) return false;
    return this.getdata.isFavorit(e.id, e.termin_id);
  }

  toggleFav() {
    const e = this.entrySig();
    if (!e) return;
    this.getdata.toogleFavorit(e.id, e.termin_id);
  }
}
