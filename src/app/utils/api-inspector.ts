export class ApiInspector {
  /** Listet alle Keys, ein Sample und Vorkommen je Feld. */
  static logFields(rows: any[]) {
    if (!rows || !rows.length) {
      console.warn('[API] Keine Daten geladen.');
      return;
    }
    const keys = new Set<string>();
    for (const r of rows) Object.keys(r || {}).forEach((k) => keys.add(k));

    console.group('[API] Verfügbare Felder');
    console.log('Felder:', [...keys].sort());
    console.table(rows[0]); // Beispielzeile

    const stats = [...keys].map((k) => ({
      field: k,
      present: rows.filter((r) => r && r[k] != null && r[k] !== '').length,
      sample: rows.find((r) => r && r[k] != null)?.[k],
    }));
    console.table(stats);
    console.groupEnd();
  }

  /** Zeigt eindeutige Werte eines Feldes (z.B. Kategorie/Format). */
  static uniqueValues(rows: any[], field: string, limit = 50) {
    if (!rows || !rows.length) {
      console.warn('[API] Keine Daten geladen.');
      return;
    }
    const set = new Set<any>();
    for (const r of rows) if (r && r[field] != null) set.add(r[field]);
    const values = [...set];
    console.group(`[API] Unique für "${field}" (${values.length})`);
    console.log(values.slice(0, limit));
    if (values.length > limit)
      console.log(`… +${values.length - limit} weitere`);
    console.groupEnd();
  }
}
