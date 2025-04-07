import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: false
})
export class HeaderComponent {
  @Output() changeFilter = new EventEmitter();
  @Input() selectedFilter?: 'rising' | 'falling' | null;

  change(filter: string) {
    this.changeFilter.emit(filter)
  }
}
