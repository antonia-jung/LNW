import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { Tab2Page } from './tab2.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    Tab2PageRoutingModule,
    Tab2Page, // ⬅️ Standalone-Komponente hier importieren
  ],
  // keine declarations!
})
export class Tab2PageModule {}
