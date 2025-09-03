import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
  ],
  templateUrl: './impressum.page.html',
  styleUrls: ['./impressum.page.scss'],
})
export class ImpressumPage {}
