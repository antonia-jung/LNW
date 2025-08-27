import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

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

  constructor(private storage: Storage) {
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

        // ---------- TEST: Favoriten nach dem Laden ----------
        if (this.data.length > 0) {
          const first = this.data[0];
          this.toogleFavorit(first.id, first.termin_id).then(() => {
            console.log('Favoriten:', this.favoriten);
            console.log(
              'isFavorit (1. Eintrag):',
              this.isFavorit(first.id, first.termin_id)
            );
          });
        } else {
          console.warn('Keine Daten geladen – Favoriten-Test übersprungen.');
        }
        // ----------------------------------------------------
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
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
      this.data = [];
      this.orte = [];
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
    await this.storage.set('favoriten', this.favoriten);
  }

  // ----------------------
  // CRUD-Beispiele: favoritesYear
  // ----------------------
  /** favoritesYear im Storage speichern */
  async saveFavoritesYear(value: string) {
    this.favoritesYear = value;
    await this.storage.set('favoritesYear', value);
  }

  /** favoritesYear aus dem Storage laden (mit Fallback "") */
  async loadFavoritesYear() {
    this.favoritesYear = (await this.storage.get('favoritesYear')) || '';
    return this.favoritesYear;
  }

  /** favoritesYear löschen */
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
