import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { GetdataService, EintragData } from '../services/getdata.service';
import { FormsModule } from '@angular/forms';
import { EintragComponent } from '../components/eintrag/eintrag.component';

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
  filters: Record<FilterKey, boolean> = {
    kinder: false,
    barrierefrei: false,
    english: false,
  };

  visibleEntries = 30;
  increment = 30;

  selectedSegment: string = 'Komplett';
  contentSelector: string = 'Komplett';
  segmentLabel: string = 'Komplett';
  selectedTheme: string = '';

  eintraege: EintragData[] = [];
  lastBeginn: string = '';

  constructor(public getdata: GetdataService, private router: Router) {
    this.setEintraege();
  }

  // TrackBy für ngFor
  trackById(_: number, item: EintragData) {
    return `${item.id}-${item.termin_id}`;
  }

  // Detailseite öffnen
  openDetail(item: EintragData) {
    this.router.navigate(['/detail', item.id, item.termin_id]);
  }

  goImpressum() {
    this.router.navigateByUrl('/impressum', { replaceUrl: false });
  }

  // FAB-Filter
  toggleFilter(key: FilterKey) {
    this.filters[key] = !this.filters[key];
  }

  isActive(key: FilterKey) {
    return !!this.filters[key];
  }

  clearFilters() {
    this.filters = { kinder: false, barrierefrei: false, english: false };
  }

  // Favoriten
  async toggleFavorit(item: EintragData) {
    await this.getdata.toogleFavorit(item.id, item.termin_id);
    item.favorit = this.getdata.isFavorit(item.id, item.termin_id);
  }

  // Segment
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

  // Einträge laden + sortieren + filtern
  setEintraege() {
    const favSet = new Set(
      this.getdata.favoriten.map((f) => `${f.id}::${f.termin_id}`)
    );

    let entries: EintragData[] = [];

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

    // Favoriten-Flag setzen
    this.eintraege = entries.map((item) => ({
      ...item,
      favorit: favSet.has(`${item.id}::${item.termin_id}`),
    }));

    // Sortieren
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

  // Gruppieren + Filter (für FAB Filter)
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

  // Unique Lists für Auswahlmenüs
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

  setBeginn(eintrag: EintragData, index: number): boolean {
    if (index === 0 || eintrag.beginn !== this.lastBeginn) {
      this.lastBeginn = eintrag.beginn;
      return true;
    }
    return false;
  }
}
