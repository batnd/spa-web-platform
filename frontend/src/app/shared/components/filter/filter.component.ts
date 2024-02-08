import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FilterType} from "../../../../types/filter.type";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Input()
  public filterData: FilterType | null = null;
  @Output()
  public removeSelectedFilter: EventEmitter<FilterType> = new EventEmitter<FilterType>();

  public removeFilter(): void {
    if (this.filterData) this.removeSelectedFilter.emit(this.filterData);
  }
}
