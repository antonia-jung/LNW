import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { GetdataService, EintragData } from '../services/getdata.service';

type Group = { time: string; items: EintragData[] };

@Component({
  selector: 'app-tab3',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    NgIf,
    NgFor,
  ],
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page {
  constructor(public getdata: GetdataService, private router: Router) {}

  /** Header-Button: Impressum öffnen */
  goImpressum() {
    this.router.navigate(['/impressum']);
  }

  /** Favoriten-Einträge aus dem Service */
  getFavoriten(): EintragData[] {
    return this.getdata.getFavoritenEntries();
  }

  /** Gruppierung der Favoriten nach Zeit (HH:MM) – analog zu Tab 2 */
  getGroupedFavoriten(): Group[] {
    const favs = this.getFavoriten();
    if (!favs.length) return [];

    const grouped: Record<string, EintragData[]> = {};
    favs.forEach((item) => {
      const time = item.beginn; // bereits "HH:MM" formatiert
      if (!grouped[time]) grouped[time] = [];
      grouped[time].push(item);
    });

    return Object.keys(grouped)
      .sort((a, b) => {
        const [aH, aM] = a.split(':').map(Number);
        const [bH, bM] = b.split(':').map(Number);
        return aH !== bH ? aH - bH : aM - bM;
      })
      .map((time) => ({ time, items: grouped[time] }));
  }

  trackById = (_: number, item: EintragData) => `${item.id}::${item.termin_id}`;

  openDetail(item: EintragData) {
    this.router.navigate(['/detail', item.id, item.termin_id]);
  }

  formatTime(v?: string): string {
    return v ?? '';
  }

  async toggleFav(item: EintragData, ev: Event) {
    ev.stopPropagation(); // Karte nicht öffnen
    await this.getdata.toogleFavorit(item.id, item.termin_id);
  }
}
