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
  /* ============================= */
  /* ======== Konstruktor ========= */
  /* ============================= */
  constructor(public getdata: GetdataService, private router: Router) {}

  /* ============================= */
  /* ======== Header / Navigation = */
  /* ============================= */

  /** Header-Button: Impressum öffnen */
  goImpressum() {
    this.router.navigate(['/impressum']);
  }

  /* ============================= */
  /* ======== Favoriten ========== */
  /* ============================= */

  /** Favoriten-Einträge aus dem Service abrufen */
  getFavoriten(): EintragData[] {
    return this.getdata.getFavoritenEntries();
  }

  /** Gruppierung der Favoriten nach Zeit (HH:MM) */
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

  /* ============================= */
  /* ======== Karten / Details === */
  /* ============================= */

  // TrackBy für ngFor, verbessert Performance
  trackById = (_: number, item: EintragData) => `${item.id}::${item.termin_id}`;

  // Detailseite öffnen beim Klick auf Karte
  openDetail(item: EintragData) {
    this.router.navigate(['/detail', item.id, item.termin_id]);
  }

  // Zeit-Formatierung (optional, aktuell nur passt-through)
  formatTime(v?: string): string {
    return v ?? '';
  }

  /* ============================= */
  /* ======== Favoriten-Toggle === */
  /* ============================= */

  /** Favoriten umschalten, Karte nicht öffnen */
  async toggleFav(item: EintragData, ev: Event) {
    ev.stopPropagation();
    await this.getdata.toogleFavorit(item.id, item.termin_id);
  }
}
