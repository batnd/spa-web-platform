import {ArticleService} from "./article.service";
import {CategoriesResponseType} from "../../../types/categories-response.type";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";
import {TestBed} from "@angular/core/testing";
import {FilterSelectType} from "../../../types/filter-select.type";
import {HttpClientTestingModule, HttpTestingController, TestRequest} from "@angular/common/http/testing";

describe('ArticleService', (): void => {
  let articleService: ArticleService;
  let httpServiceSpy: jasmine.SpyObj<HttpClient>;
  let httpTestingController: HttpTestingController;
  const mockCategory: CategoriesResponseType[] = [
    {
      id: "6513f60e529699348d89c02f",
      name: "Фриланс",
      url: "frilans"
    },
    {
      id: "6513f60e529699348d89c030",
      name: "Дизайн",
      url: "dizain"
    },
    {
      id: "6513f60e529699348d89c031",
      name: "SMM",
      url: "smm"
    },
  ];
  const mockParams: {page: number, categories: string[]} = {
    page: 1,
    categories: ['target']
  };

  beforeEach((): void => {
    httpServiceSpy = jasmine.createSpyObj('HttpClient', ['get']);
  });

  it("should return array of objects with new field 'active: false' in every object", (done: DoneFn): void => {
    httpServiceSpy.get.and.returnValue(of(mockCategory));
    TestBed.configureTestingModule({
      providers: [
        ArticleService,
        { provide: HttpClient, useValue: httpServiceSpy }
      ]
    });
    articleService = TestBed.inject(ArticleService);

    articleService.getCategories().subscribe((categories: FilterSelectType[]): void => {
        expect(categories).toEqual([
          {
            id: "6513f60e529699348d89c02f",
            name: "Фриланс",
            url: "frilans",
            active: false
          },
          {
            id: "6513f60e529699348d89c030",
            name: "Дизайн",
            url: "dizain",
            active: false
          },
          {
            id: "6513f60e529699348d89c031",
            name: "SMM",
            url: "smm",
            active: false
          },
        ]);
        done();
      });
  });

  it("should add params to request options", (): void => {
    TestBed.configureTestingModule({
      providers: [ArticleService],
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    articleService = TestBed.inject(ArticleService);

    articleService.getArticles(mockParams).subscribe();
    const req: TestRequest = httpTestingController.expectOne('http://localhost:3000/api/articles?page=1&categories=target');

    const paramPage: string | null = req.request.params.get('page');
    const paramCategories: string | null = req.request.params.get('categories');
    expect((paramPage === '' + mockParams.page) && (paramCategories === mockParams.categories[0])).toBeTruthy();
  });

});
