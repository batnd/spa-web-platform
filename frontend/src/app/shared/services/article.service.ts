import {inject, Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {ArticleCardType} from "../../../types/article-card.type";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ArticlesResponseType} from "../../../types/articles-response.type";
import {CategoriesResponseType} from "../../../types/categories-response.type";
import {FilterParamsType} from "../../../types/filter-params.type";
import {FilterSelectType} from "../../../types/filter-select.type";
import {ArticleResponseType} from "../../../types/article-response.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private http: HttpClient = inject(HttpClient);
  private articlesApi: string = environment.api + 'articles'; // http://localhost:3000/api/articles

  public getCategories(): Observable<FilterSelectType[]> {
    return this.http.get<CategoriesResponseType[]>(environment.api + 'categories')
      // Добавляю в категории свойство active
      .pipe(
        map((categories: CategoriesResponseType[]) => {
          const categoriesWithActive: FilterSelectType[] = [];
          categories.forEach((category: CategoriesResponseType): void => {
            categoriesWithActive.push({
              id: category.id,
              name: category.name,
              url: category.url,
              active: false
            });
          });
          return categoriesWithActive;
        })
      );
  }
  public getPopularArticles(): Observable<ArticleCardType[]> {
    return this.http.get<ArticleCardType[]>(this.articlesApi + '/top');
  }

  public getArticles(params: FilterParamsType): Observable<ArticlesResponseType> {
    return this.http.get<ArticlesResponseType>(this.articlesApi, {
      params: params
    });
  }

  public getArticle(articleUrl: string): Observable<ArticleResponseType> {
    return this.http.get<ArticleResponseType>(this.articlesApi + `/${articleUrl}`);
  }

  public getRelatedArticles(articleUrl: string): Observable<ArticleCardType[]> {
    return this.http.get<ArticleCardType[]>(this.articlesApi + `/related/${articleUrl}`);
  }
}
