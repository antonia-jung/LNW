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
        /* ignore */
      }
    }

    const found =
      id && terminId
        ? this.getdata.data?.find(
            (e: EintragData) => e.id === id && e.termin_id === terminId
          ) ?? null
        : null;

    this.entrySig.set(found);
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
    return !!(e && this.getdata.isFavorit(e.id, e.termin_id));
  }
  toggleFav() {
    const e = this.entrySig();
    if (e) this.getdata.toogleFavorit(e.id, e.termin_id);
  }

  /** Formatiert Zeiten robust: akzeptiert ISO-Datum, Date, Timestamp oder "HH:mm". */
  formatTime(v: any): string {
    if (!v) return '';
    // Bereits "HH:mm"?
    if (typeof v === 'string') {
      const m = v.match(/^(\d{1,2}):([0-5]\d)$/);
      if (m) {
        const hh = m[1].padStart(2, '0');
        const mm = m[2];
        return `${hh}:${mm}`;
      }
      // Versuche als Datum zu interpretieren
      const d = new Date(v);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      }
      return v; // Fallback: zeige Rohwert
    }
    // Zahl (epoch) oder Date
    if (typeof v === 'number') {
      const d = new Date(v);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      }
      return String(v);
    }
    if (v instanceof Date && !isNaN(v.getTime())) {
      return v.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
    return String(v);
  }

  /** Themen als Komma-Liste (String oder Array). */
  themenText(): string {
    const v: any = (this.entrySig() as any)?.themen;
    if (Array.isArray(v)) return v.filter(Boolean).join(', ');
    if (typeof v === 'string') return v;
    return v != null ? String(v) : '';
  }
}
