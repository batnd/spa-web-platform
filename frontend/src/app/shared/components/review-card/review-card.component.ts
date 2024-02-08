import {Component, Input} from '@angular/core';
import {ReviewCardType} from "../../../../types/review-card.type";

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss']
})
export class ReviewCardComponent {
  @Input()
  public reviewCardData: ReviewCardType | null = null;
}
