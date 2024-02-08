import {ArticleCardType} from "./article-card.type";

export type ArticlesResponseType = {
  count: number,
  pages: number,
  items: ArticleCardType[]
}


