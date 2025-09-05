import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EintragData, GetdataService } from '../../services/getdata.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eintrag',
  templateUrl: './eintrag.component.html',
  styleUrls: ['./eintrag.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class EintragComponent {
  @Input() eintrag!: EintragData;
  @Output() click = new EventEmitter<void>();

  constructor(public getdata: GetdataService) {}

  clickHandler() {
    this.click.emit();
  }

  isFavorit() {
    return this.getdata.isFavorit(this.eintrag.id, this.eintrag.termin_id);
  }
}
