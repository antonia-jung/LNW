import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { GetdataService } from '../services/getdata.service';

type FilterKey = 'kinder' | 'barrierefrei' | 'english';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ExploreContainerComponentModule],
})
export class Tab2Page {
  // AND-Filter: true = muss erfüllt sein
  filters: Record<FilterKey, boolean> = {
    kinder: false,
    barrierefrei: false,
    english: false,
  };

  // Infinite Scroll
  visibleEntries = 30; // Anzahl der aktuell sichtbaren Einträge
  increment = 30; // Anzahl der Einträge, die pro Scroll nachgeladen werden

  constructor(public getdata: GetdataService, private router: Router) {}

  trackById(_: number, item: { id: string; termin_id: string }) {
    return `${item.id}-${item.termin_id}`;
  }

  openDetail(item: { id: string; termin_id: string }) {
    this.router.navigate(['/detail', item.id, item.termin_id]);
  }

  goImpressum() {
    this.router.navigateByUrl('/impressum', { replaceUrl: false });
  }

  toggleFilter(key: FilterKey) {
    this.filters[key] = !this.filters[key];
  }

  isActive(key: FilterKey) {
    return !!this.filters[key];
  }

  clearFilters() {
    this.filters = { kinder: false, barrierefrei: false, english: false };
  }

  /** Gefilterte + gruppierte Daten (AND-Logik) */
  get filteredGroups(): { time: string; items: any[] }[] {
    const data = this.getdata.data ?? [];

    // Wenn gar kein Filter aktiv → alle Einträge
    const anyActive =
      this.filters.kinder || this.filters.barrierefrei || this.filters.english;

    const filtered = anyActive
      ? data.filter((item: any) => {
          if (this.filters.kinder && !item.kinder) return false;
          if (this.filters.barrierefrei && !item.barrierefrei) return false;
          if (this.filters.english && !item.english) return false;
          return true;
        })
      : data;

    // Gruppieren wie gehabt (nach Beginn "HH:MM")
    const grouped: Record<string, any[]> = {};
    for (const item of filtered) {
      const time = item.beginn;
      (grouped[time] ||= []).push(item);
    }

    return Object.keys(grouped)
      .sort((a, b) => {
        const [aH, aM] = a.split(':').map(Number);
        const [bH, bM] = b.split(':').map(Number);
        return aH !== bH ? aH - bH : aM - bM;
      })
      .map((time) => ({ time, items: grouped[time] }));
  }

  /** Infinite Scroll Logik */
  ladeMehrDaten(event?: any) {
    // Prüfen, ob schon alle Einträge angezeigt werden
    if (this.visibleEntries >= this.getdata.data.length) {
      event.target.disabled = true; // Deaktiviere Infinite Scroll
      event.target.complete(); // Ladeprozess beenden
      return;
    }

    setTimeout(() => {
      this.visibleEntries += this.increment;
      event.target.complete();

      // Wenn alle Einträge sichtbar → Infinite Scroll deaktivieren
      if (this.visibleEntries >= this.getdata.data.length) {
        event.target.disabled = true;
      }
    }, 500); // Simulierte Ladezeit
  }
}
