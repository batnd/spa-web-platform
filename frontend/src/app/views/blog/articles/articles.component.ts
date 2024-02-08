import {Component, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleCardType} from "../../../../types/article-card.type";
import {FilterSelectType} from "../../../../types/filter-select.type";
import {ArticlesResponseType} from "../../../../types/articles-response.type";
import {CategoriesResponseType} from "../../../../types/categories-response.type";
import {debounceTime} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FilterParamsType} from "../../../../types/filter-params.type";
import {FilterType} from "../../../../types/filter.type";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  private articleService: ArticleService = inject(ArticleService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  private activeParams: FilterParamsType = {};

  public articles: ArticleCardType[] = [];
  public articlesMocks: number[] = [1,2,3,4,5,6,7,8];
  public currentPage: number = 1;
  public totalPages: number[] = [];
  public selectedFilters: CategoriesResponseType[] = [];
  public filterSelectCategories: FilterSelectType[] = [];

  @ViewChild('filterHeader', {static: true})
  private filterHead: ElementRef | null = null;
  public filterSelectClass: string = 'filterSel';

  @HostListener('click', ['$event.target'])
  closeFilterBody(element: EventTarget): void {
    const isClickedBackdrop: boolean = (element as HTMLElement).classList.contains(this.filterSelectClass);
    if (!isClickedBackdrop) this.filterHead?.nativeElement.classList.remove('active');
  }

  ngOnInit(): void {
    // Получаем категории для фильтра
    this.articleService.getCategories()
      .subscribe( (categories: FilterSelectType[]): void => {
        this.filterSelectCategories = categories;

        // Подписываемся на изменения query-параметров
        this.activatedRoute.queryParams
          .pipe(
            debounceTime(500)
          )
          .subscribe((params: Params): void => {
            const categories: string[] | string | undefined = params['categories'];
            const page: string | undefined = params['page'];

            if (page) {
              this.activeParams.page = +page;
              this.currentPage = +page;
            } else {
              this.activeParams.page = 1;
              this.currentPage = 1;
            }

            this.activeParams.categories = [];
            this.selectedFilters = [];

            if (categories) {
              if (Array.isArray(categories)) {
                categories.forEach((queryCategory: string): void => {
                  this.activeParams.categories?.push(queryCategory);

                  this.filterSelectCategories = this.filterSelectCategories.map((category: FilterSelectType) => {
                    if (category.url === queryCategory) {
                      this.selectedFilters.push(category);
                      category.active = true;
                    }
                    return category;
                  });

                });
              } else {
                this.activeParams.categories.push(categories);

                this.filterSelectCategories = this.filterSelectCategories.map((category: FilterSelectType) => {
                  if (category.url === categories) {
                    this.selectedFilters.push(category);
                    category.active = true;
                  }
                  return category;
                });
              }
            } else {
              this.filterSelectCategories = this.filterSelectCategories.map((category: FilterSelectType) => {
                category.active = false;
                return category;
              });
            }

            // При изменении query-параметров запрашиваем и получаем подходящие статьи
            this.articleService.getArticles(this.activeParams)
              .subscribe((response: ArticlesResponseType): void => {
                const totalPages: number = response.pages;
                this.totalPages = [];
                for (let i: number = 1; i <= totalPages; i++) this.totalPages.push(i);

                if (this.activeParams.page) {
                  if (this.activeParams.page > totalPages && response.items.length === 0) {
                    this.activeParams.page = 1;
                    this.router.navigate(['/articles'], { queryParams: this.activeParams });
                  } else {
                    this.articles = response.items;
                  }
                } else {
                  this.articles = response.items;
                }
              });
          });
      });
  }

  public updateFilterSelect(filterItem: FilterSelectType): void {
    this.filterSelectCategories = this.filterSelectCategories.map((item: FilterSelectType): FilterSelectType => {
      if (item.url === filterItem.url) item.active = !item.active;
      return item;
    });

    if (this.activeParams.categories) {
      if (this.activeParams.categories.includes(filterItem.url)) {
        const newActiveParams: string[] = this.activeParams.categories.filter((param: string): string | undefined => {
          if (param === filterItem.url) return;
          return param;
        });
        this.activeParams = { page: 1, categories: newActiveParams };
      } else {
        this.activeParams.page = 1;
        this.activeParams.categories.push(filterItem.url);
      }
    } else {
      this.activeParams = { page: 1, categories: [filterItem.url] };
    }

    this.router.navigate(['/articles'], { queryParams: this.activeParams });
  }

  public removeCategoryFromSelected(filterItem: FilterType): void {
    if (this.activeParams.categories?.includes(filterItem.url)) {
      this.activeParams.categories = this.activeParams.categories?.filter((category: string): string | undefined => {
        if (category === filterItem.url) return;
        return category;
      });

      this.selectedFilters = this.selectedFilters.filter((category: CategoriesResponseType): CategoriesResponseType | undefined => {
        if (category.url === filterItem.url) return;
        return category;
      });

      this.filterSelectCategories = this.filterSelectCategories.map((item: FilterSelectType): FilterSelectType => {
        if (item.url === filterItem.url) item.active = false;
        return item;
      });

      this.router.navigate(['/articles'], { queryParams: this.activeParams });
    }
  }

  public openPage(pageNumber: number): void {
    if (this.activeParams.page === pageNumber) return;
    this.activeParams.page = pageNumber;

    this.router.navigate(['/articles'], { queryParams: this.activeParams });
  }

  public movePage(pageType: string): void {
    if (pageType === 'prev') {
      if (this.activeParams.page) {
        if (this.activeParams.page === 1) return;
        this.activeParams.page = --this.activeParams.page;
        this.router.navigate(['/articles'], { queryParams: this.activeParams });
      }
    }
    if (pageType === 'next') {
      if (this.activeParams.page) {
        if (this.activeParams.page === this.totalPages.length) return;
        this.activeParams.page = ++this.activeParams.page;
        this.router.navigate(['/articles'], { queryParams: this.activeParams });
      }
    }
  }
}
