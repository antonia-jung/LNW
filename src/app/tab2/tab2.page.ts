import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { GetdataService, EintragData } from '../services/getdata.service';
import { FormsModule } from '@angular/forms';
import { EintragComponent } from '../components/eintrag/eintrag.component';

// Filter-Typen für FAB-Filter
type FilterKey = 'kinder' | 'barrierefrei' | 'english';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    EintragComponent,
  ],
})
export class Tab2Page {
  /* ============================= */
  /* ======== State / Properties = */
  /* ============================= */
  filters: Record<FilterKey, boolean> = {
    kinder: false,
    barrierefrei: false,
    english: false,
  };

  visibleEntries = 30; // Anzahl aktuell sichtbarer Einträge
  increment = 30; // Anzahl, die bei Scroll nachgeladen wird

  selectedSegment: string = 'Komplett';
  contentSelector: string = 'Komplett';
  segmentLabel: string = 'Komplett';
  selectedTheme: string = '';

  eintraege: EintragData[] = [];
  lastBeginn: string = '';

  /* ============================= */
  /* ======== Konstruktor ========= */
  /* ============================= */
  constructor(public getdata: GetdataService, private router: Router) {
    this.setEintraege();
  }

  /* ============================= */
  /* ======== Utility Methods ===== */
  /* ============================= */

  // TrackBy für ngFor, verbessert Performance
  trackById(_: number, item: EintragData) {
    return `${item.id}-${item.termin_id}`;
  }

  // Navigation zur Detailseite
  openDetail(item: EintragData) {
    this.router.navigate(['/detail', item.id, item.termin_id]);
  }

  // Navigation zum Impressum
  goImpressum() {
    this.router.navigateByUrl('/impressum', { replaceUrl: false });
  }

  /* ============================= */
  /* ======== FAB Filter ========= */
  /* ============================= */
  toggleFilter(key: FilterKey) {
    this.filters[key] = !this.filters[key];
  }

  isActive(key: FilterKey) {
    return !!this.filters[key];
  }

  clearFilters() {
    this.filters = { kinder: false, barrierefrei: false, english: false };
  }

  /* ============================= */
  /* ======== Favoriten ========== */
  /* ============================= */
  async toggleFavorit(item: EintragData) {
    await this.getdata.toogleFavorit(item.id, item.termin_id);
    item.favorit = this.getdata.isFavorit(item.id, item.termin_id);
  }

  /* ============================= */
  /* ======== Segment / Theme ==== */
  /* ============================= */
  setSegmentLabel(label: string) {
    this.segmentLabel = label;
    this.contentSelector = label;
    this.selectedTheme = '';
    this.setEintraege();
  }

  selectTheme(theme: string) {
    this.selectedTheme = theme;
    this.setEintraege();
  }

  /* ============================= */
  /* ======== Einträge laden ===== */
  /* ============================= */
  setEintraege() {
    const favSet = new Set(
      this.getdata.favoriten.map((f) => `${f.id}::${f.termin_id}`)
    );

    let entries: EintragData[] = [];

    // Filtern nach Segment + Theme
    switch (this.contentSelector) {
      case 'Komplett':
        entries = [...this.getdata.data];
        break;
      case 'Themen':
        if (this.selectedTheme) {
          entries = this.getdata.data.filter((item) =>
            item.themen
              ?.split(',')
              .map((t) => t.trim())
              .includes(this.selectedTheme)
          );
        }
        break;
      case 'Formate':
        if (this.selectedTheme) {
          entries = this.getdata.data.filter(
            (item) => item.format === this.selectedTheme
          );
        }
        break;
      case 'Orte':
        if (this.selectedTheme) {
          entries = this.getdata.data.filter(
            (item) => item.ort === this.selectedTheme
          );
        }
        break;
      case 'Einrichtungen':
        if (this.selectedTheme) {
          entries = this.getdata.data.filter(
            (item) => item.einrichtung === this.selectedTheme
          );
        }
        break;
    }

    // Favoriten markieren
    this.eintraege = entries.map((item) => ({
      ...item,
      favorit: favSet.has(`${item.id}::${item.termin_id}`),
    }));

    // Einträge sortieren nach Zeit & Titel
    this.eintraege.sort((a, b) =>
      a.beginn > b.beginn
        ? 1
        : a.beginn < b.beginn
        ? -1
        : a.titel.localeCompare(b.titel)
    );

    this.visibleEntries = 30;
    this.lastBeginn = '';
  }

  /* ============================= */
  /* ======== Gruppen + Filter ==== */
  /* ============================= */
  get filteredGroups(): { time: string; items: EintragData[] }[] {
    const data = this.eintraege ?? [];

    const anyActive =
      this.filters.kinder || this.filters.barrierefrei || this.filters.english;

    const filtered = anyActive
      ? data.filter((item: EintragData) => {
          if (this.filters.kinder && !item.kinder) return false;
          if (this.filters.barrierefrei && !item.barrierefrei) return false;
          if (this.filters.english && !item.english) return false;
          return true;
        })
      : data;

    const grouped: Record<string, EintragData[]> = {};
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

  /* ============================= */
  /* ======== Infinite Scroll ===== */
  /* ============================= */
  ladeMehrDaten(event?: any) {
    if (this.visibleEntries >= this.eintraege.length) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }

    setTimeout(() => {
      this.visibleEntries += this.increment;
      event.target.complete();
      if (this.visibleEntries >= this.eintraege.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  /* ============================= */
  /* ======== Unique Listen ======= */
  /* ============================= */
  get uniqueThemes(): string[] {
    const allThemes = this.getdata.data
      .map(
        (e: EintragData) =>
          e.themen?.split(',').map((t: string) => t.trim()) || []
      )
      .reduce((acc, val) => acc.concat(val), []);
    return Array.from(new Set(allThemes)).sort();
  }

  get uniqueFormats(): string[] {
    return Array.from(
      new Set(this.getdata.data.map((e: EintragData) => e.format))
    ).sort();
  }

  get uniqueOrte(): string[] {
    return Array.from(
      new Set(this.getdata.data.map((e: EintragData) => e.ort))
    ).sort();
  }

  get uniqueEinrichtungen(): string[] {
    return Array.from(
      new Set(this.getdata.data.map((e: EintragData) => e.einrichtung))
    ).sort();
  }

  /* ============================= */
  /* ======== Hilfsfunktionen ===== */
  /* ============================= */

  // Nur Überschrift für neue Zeit anzeigen
  setBeginn(eintrag: EintragData, index: number): boolean {
    if (index === 0 || eintrag.beginn !== this.lastBeginn) {
      this.lastBeginn = eintrag.beginn;
      return true;
    }
    return false;
  }

  // Anzahl Einträge pro Thema / Format / Ort / Einrichtung
  getCountForTheme(theme: string): number {
    return this.getdata.data.filter((e) =>
      e.themen
        ?.split(',')
        .map((t) => t.trim())
        .includes(theme)
    ).length;
  }

  getCountForFormat(format: string): number {
    return this.getdata.data.filter((e) => e.format === format).length;
  }

  getCountForOrt(ort: string): number {
    return this.getdata.data.filter((e) => e.ort === ort).length;
  }

  getCountForEinrichtung(einrichtung: string): number {
    return this.getdata.data.filter((e) => e.einrichtung === einrichtung)
      .length;
  }
}
