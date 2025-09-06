import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Minimaler Zähler-Service für die Tabs-Badge.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesCounterService {
  private readonly _count$ = new BehaviorSubject<number>(0);
  readonly count$: Observable<number> = this._count$.asObservable();

  set(n: number): void {
    this._count$.next(Math.max(0, n | 0));
  }

  increment(): void {
    this._count$.next(this._count$.value + 1);
  }

  decrement(): void {
    const next = this._count$.value - 1;
    this._count$.next(next < 0 ? 0 : next);
  }
}
