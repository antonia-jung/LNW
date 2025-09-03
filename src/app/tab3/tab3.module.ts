// src/app/tab3/tab3.module.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Tab3Page } from './tab3.page';

@NgModule({
  // WICHTIG: keine declarations für Standalone-Komponenten!
  imports: [
    // Standalone-Komponente direkt importieren
    Tab3Page,

    // Route dieses Features
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
  ],
})
export class Tab3PageModule {}
