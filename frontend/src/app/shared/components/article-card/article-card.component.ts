import {Component, Input} from '@angular/core';
import {ArticleCardType} from "../../../../types/article-card.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input({ required: true })
  public article!: ArticleCardType;
  public serverStaticPath: string = environment.serverStaticPath;
}
