import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { FavoritesCounterService } from './favorites-counter.service';

// ----------------------
// Datentypen / Interfaces
// ----------------------
export interface EintragData {
  id: string;
  termin_id: string;
  titel: string;
  beschreibung: string;
  beginn: string; // wird nach dem Laden zu "HH:MM" formatiert
  ende: string; // wird nach dem Laden zu "HH:MM" formatiert
  ort: string;
  ort_id: string;
  adresse: string;
  einrichtung: string;
  verantwortlich: string;
  format: string;
  themen: string;
  kinder: boolean;
  barrierefrei: boolean;
  english: boolean;
  favorit: boolean;
}

export interface OrteData {
  ort_id: string;
  karte: number;
  google_link: string;
}

export interface Favorit {
  id: string;
  termin_id: string;
}

// ----------------------
// Service
// ----------------------
@Injectable({ providedIn: 'root' })
export class GetdataService {
  data: EintragData[] = [];
  orte: OrteData[] = [];
  counter = 0;

  // Persistente Werte
  favoriten: Favorit[] = [];
  favoritesYear = '';

  // <-- NEU: Flag für Ladezustand
  public dataLoaded: boolean = false;

  constructor(
    private storage: Storage,
    private favCounter: FavoritesCounterService
  ) {
    this.init().then(() => {
      this.loadData().then(() => {
        // Zeiten formatieren
        this.data.forEach((item) => {
          const begin = new Date(item.beginn);
          const end = new Date(item.ende);
          item.beginn = `${begin.getHours()}:${
            begin.getMinutes() < 10
              ? '0' + begin.getMinutes()
              : begin.getMinutes()
          }`;
          item.ende = `${end.getHours()}:${
            end.getMinutes() < 10 ? '0' + end.getMinutes() : end.getMinutes()
          }`;
        });

        // Kompletten Datensatz optional im Storage ablegen
        this.storage.set('data', this.data);
      });
    });
  }

  // ----------------------
  // Init Storage (SQLite + Fallbacks) & Startwerte laden
  // ----------------------
  private async init() {
    await this.storage.defineDriver(CordovaSQLiteDriver); // SQLite-Treiber registrieren (auf Gerät)
    await this.storage.create(); // Datenbank/Store anlegen

    // Persistente Werte laden (Fallback, falls Key noch nicht existiert)
    this.favoriten = (await this.storage.get('favoriten')) || [];
    this.favoritesYear = (await this.storage.get('favoritesYear')) || '';

    // ---> Badge beim Start korrekt setzen (ohne auf data warten zu müssen)
    this.favCounter.set(this.favoriten.length);
  }

  // ----------------------
  // Daten laden (API)
  // ----------------------
  async loadData() {
    try {
      const response = await fetch(
        'https://www.wissen-in-leipzig.de/json-export/'
      );
      const zwi = await response.json();
      this.data = zwi.data;
      this.orte = zwi.orte;

      // <-- NEU: wenn alles geladen, Flag setzen
      this.dataLoaded = true;
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
      this.data = [];
      this.orte = [];

      // Fehlerfall: bleibt false
      this.dataLoaded = false;
    }
  }

  // ----------------------
  // Gruppierung nach Startzeit (HH:MM)
  // ----------------------
  getGroupedData(): { time: string; items: EintragData[] }[] {
    const grouped: { [time: string]: EintragData[] } = {};
    this.data.forEach((item) => {
      const time = item.beginn;
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

  // ----------------------
  // Favoriten-Logik
  // ----------------------
  isFavorit(id: string, termin_id: string): boolean {
    return this.favoriten.some((f) => f.id === id && f.termin_id === termin_id);
  }

  async toogleFavorit(id: string, termin_id: string) {
    // (optional: in toggleFavorit umbenennen)
    const idx = this.favoriten.findIndex(
      (f) => f.id === id && f.termin_id === termin_id
    );
    if (idx >= 0) {
      this.favoriten.splice(idx, 1);
    } else {
      this.favoriten.push({ id, termin_id });
    }

    // Persistieren
    await this.storage.set('favoriten', this.favoriten);

    // ---> Badge nach jeder Änderung aktualisieren
    this.favCounter.set(this.favoriten.length);
  }

  /** Liste der favorisierten Einträge (robust, falls data leer) */
  getFavoritenEntries(): EintragData[] {
    if (!this.data?.length || !this.favoriten?.length) return [];
    const favSet = new Set(
      this.favoriten.map((f) => `${f.id}::${f.termin_id}`)
    );
    return this.data.filter((e) => favSet.has(`${e.id}::${e.termin_id}`));
  }

  /** Anzahl der Favoriten (falls du es irgendwo direkt brauchst) */
  getFavoritenCount(): number {
    return this.favoriten.length;
  }

  // ----------------------
  // CRUD-Beispiele: favoritesYear
  // ----------------------
  async saveFavoritesYear(value: string) {
    this.favoritesYear = value;
    await this.storage.set('favoritesYear', value);
  }

  async loadFavoritesYear() {
    this.favoritesYear = (await this.storage.get('favoritesYear')) || '';
    return this.favoritesYear;
  }

  async clearFavoritesYear() {
    this.favoritesYear = '';
    await this.storage.remove('favoritesYear');
  }

  // ----------------------
  // Sonstiges (Counter)
  // ----------------------
  incrementCounter() {
    this.counter++;
  }
  decrementCounter() {
    this.counter--;
  }
}
