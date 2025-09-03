import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs-routing.module';

@NgModule({
  declarations: [TabsPage],
  imports: [CommonModule, IonicModule, RouterModule, TabsPageRoutingModule],
})
export class TabsPageModule {}
