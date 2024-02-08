import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ServiceCardType} from "../../../../types/service-card.type";

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss']
})
export class ServiceCardComponent {
  @Input()
  public serviceCardData: ServiceCardType = {} as ServiceCardType;
  @Output()
  public chooseServiceType: EventEmitter<string> = new EventEmitter<string>();

  public showModal(): void {
    this.chooseServiceType.emit(this.serviceCardData.serviceType);
  }
}
