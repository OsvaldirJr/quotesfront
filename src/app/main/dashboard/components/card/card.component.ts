import { Component, Input } from '@angular/core';
import { Quotes } from '@core/models';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent { 
  @Input() quote?: Quotes
}
