import { Injectable } from '@angular/core';

// Datenstruktur für die eingehenden Daten
export interface EintragData {
  id: string;
  termin_id: string;
  titel: string;
  beschreibung: string;
  beginn: string;
  ende: string;
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

@Injectable({
  providedIn: 'root',
})
export class GetdataService {
  data: EintragData[] = [];
  orte: OrteData[] = [];
  counter = 0;

  getGroupedData(): { time: string; items: EintragData[] }[] {
    const grouped: { [time: string]: EintragData[] } = {};

    this.data.forEach((item) => {
      const time = item.beginn;
      if (!grouped[time]) {
        grouped[time] = [];
      }
      grouped[time].push(item);
    });

    return Object.keys(grouped)
      .sort((a, b) => {
        const [aHour, aMin] = a.split(':').map(Number);
        const [bHour, bMin] = b.split(':').map(Number);
        return aHour !== bHour ? aHour - bHour : aMin - bMin;
      })
      .map((time) => ({
        time,
        items: grouped[time],
      }));
  }

  constructor() {
    this.loadData().then(() => {
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

      console.log(this.data);
    });
  }

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
    }
  }

  incrementCounter() {
    this.counter++;
  }

  decrementCounter() {
    this.counter--;
  }
}
