import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { GetdataService } from '../services/getdata.service';

@Component({
  selector: 'app-tab2',
  standalone: true,
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  imports: [
    CommonModule,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonIcon,
    IonItem,
    IonLabel,
    ExploreContainerComponentModule,
  ],
})
export class Tab2Page {
  constructor(public getdataservice: GetdataService) {}
}
