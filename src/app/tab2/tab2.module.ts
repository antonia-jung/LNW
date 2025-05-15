import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { Tab2Page } from './tab2.page'; // bleibt gleich

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    Tab2Page, // 👈 WICHTIG: standalone-Komponente hier importieren!
  ],
})
export class Tab2PageModule {}
