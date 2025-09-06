import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FavoritesCounterService } from '../services/favorites-counter.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit, OnDestroy {
  favoritesCount = 0;
  private sub?: Subscription;

  constructor(private favCounter: FavoritesCounterService) {}

  ngOnInit(): void {
    this.sub = this.favCounter.count$.subscribe((n: number) => {
      this.favoritesCount = n;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
