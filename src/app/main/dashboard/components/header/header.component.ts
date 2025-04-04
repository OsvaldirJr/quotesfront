import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent { 
  @Output() changeFilter = new EventEmitter();
  @Input() selectedFilter?: string;

  change(filter: string){
    this.changeFilter.emit(filter)
  }
}
