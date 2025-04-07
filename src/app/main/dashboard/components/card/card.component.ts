import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Quotes } from '@core/models';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    animations: [
      trigger('textColorChange', [
        state('true', style({ color: 'oklch(79.2% 0.209 151.711)' })),
        state('false', style({ color: 'oklch(70.4% 0.191 22.216)' })),
        transition('true <=> false', animate('500ms ease-in-out'))
      ])
    ],
    standalone: false
})
export class CardComponent { 
  @Input() quote?: any
}
