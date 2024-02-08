import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController, TestRequest} from "@angular/common/http/testing";
import {CommentService} from "./comment.service";

describe('CommentService', (): void => {
  let commentService: CommentService;
  let httpTestingController: HttpTestingController;
  const testText: string = 'Comment 1';
  const testArticle: string = '63ca02683fe296dbe1e873e2';

  beforeEach((): void => {
    TestBed.configureTestingModule({
      providers: [CommentService],
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    commentService = TestBed.inject(CommentService);
  });

  it("should add text and article to request body", (): void => {
    commentService.addComment(testText, testArticle).subscribe();
    const req: TestRequest = httpTestingController.expectOne('http://localhost:3000/api/comments');
    const bodyText: string = req.request.body['text'];
    const bodyArticle: string = req.request.body['article'];
    expect((bodyText === testText) && (bodyArticle === testArticle)).toBeTruthy();
  });

});
