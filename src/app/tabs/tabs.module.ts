import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs-routing.module';

// Importiere hier deine Tab-Seiten, falls sie in diesem Modul deklariert sind.
// Wenn Tab2Page als Standalone gebaut ist, brauchst du die Deklaration nicht.
// Beispiel (klassisch, nicht-standalone):
// import { Tab2Page } from '../tab2/tab2.page';

@NgModule({
  declarations: [
    TabsPage,
    // Tab2Page, // nur falls nicht-standalone
    // weitere Tab-Seiten …
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule, // <— stellt routerLink im Template bereit
    TabsPageRoutingModule,
  ],
})
export class TabsPageModule {}
