import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleResponseType} from "../../../../types/article-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {ArticleCardType} from "../../../../types/article-card.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentService} from "../../../shared/services/comment.service";
import {CommentsResponseType} from "../../../../types/comments-response.type";
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentsUserArticleActionsType} from "../../../../types/comments-user-article-actions.type";
import {CommentWithUserActionType} from "../../../../types/comment-with-user-action.type";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArticleComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private articleService: ArticleService = inject(ArticleService);
  private commentService: CommentService = inject(CommentService);
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);

  private currentArticleUrl: string = '';
  public currentArticleData: ArticleResponseType | null = null;
  public relatedArticles: ArticleCardType[] = [];

  public totalCommentsCount: number = 0;
  public loadedComments: CommentWithUserActionType[] = [];
  public userCommentsActions: CommentsUserArticleActionsType[] = [];
  public isCommentsLoadingNow: boolean = false;

  public isUserLoggedIn: boolean = false;
  public commentGroup: FormGroup = this.fb.group({
    text: ['', [Validators.required]]
  });

  public currentUrlForShare: string = '';

  ngOnInit(): void {
    this.currentUrlForShare = window.location.href;

    this.isUserLoggedIn = this.authService.getIsLoggedIn();
    this.authService.isLogged$
      .subscribe((isLogged: boolean): void => {
        this.isUserLoggedIn = isLogged;

        // When logout - get comments again
        if (!isLogged && this.currentArticleData) {
          this.commentService.getComments(0, this.currentArticleData.id)
            .subscribe((comments: CommentsResponseType): void => {
              if (comments.comments.length > 0) {
                this.totalCommentsCount = comments.allCount;
                this.loadedComments = (this.convertCommentResponseToCommentWithUserAction(comments)).slice(0, 3);
              }
            });
        }
      });

    this.activatedRoute.params
      .subscribe((currentUrlParam: Params): void => {
        this.currentArticleUrl = currentUrlParam['articleUrl'];

        this.articleService.getArticle(this.currentArticleUrl)
          .subscribe({
            next: (articleData: ArticleResponseType): void => {
              this.currentArticleData = articleData;

              this.articleService.getRelatedArticles(this.currentArticleUrl)
                .subscribe((relatedArticles: ArticleCardType[]) => this.relatedArticles = relatedArticles);

              this.updateComments();
            },
            error: (errorResponse: HttpErrorResponse): void => {
              if (errorResponse && errorResponse.error) {
                this.router.navigate(['/articles']);
                this._snackBar.open('Такой статьи не существует!', 'X', {panelClass: ['invalid']});
              }
            }
          });
      });
  }

  public updateComments(): void {
    if (this.currentArticleData) {
      this.isCommentsLoadingNow = false;
      // INITIALLY - get 10 comments (max.) then trim to 3 elements
      this.commentService.getComments(0, this.currentArticleData.id)
        .subscribe((comments: CommentsResponseType): void => {
          if (comments.comments.length > 0) {
            this.totalCommentsCount = comments.allCount;

            // If user is authorized - get user actions for this article
            if (this.isUserLoggedIn && this.currentArticleData) {
              this.requestAndUpdateUserActions(comments);
            } else {
              // If user is unauthorized
              this.loadedComments = (this.convertCommentResponseToCommentWithUserAction(comments)).slice(0, 3);
            }
          }
        });
    }
  }

  private requestAndUpdateUserActions(comments: CommentsResponseType): void {
    if (this.currentArticleData) {
      this.commentService.getArticleCommentActions(this.currentArticleData.id)
        .subscribe({
          next: (userActions: CommentsUserArticleActionsType[] | DefaultResponseType): void => {
            if (((userActions as DefaultResponseType).error !== undefined) || ((userActions as CommentsUserArticleActionsType[]).length === 0)) this.userCommentsActions = [];
            if ((userActions as CommentsUserArticleActionsType[]).length > 0) this.userCommentsActions = userActions as CommentsUserArticleActionsType[];

            // If there are user's actions on these article's comments -> then update comments with user's actions
            let commentsWithUserActions: CommentWithUserActionType[] = (this.convertCommentResponseToCommentWithUserAction(comments)).slice(0, 3);
            if (this.userCommentsActions.length > 0) commentsWithUserActions = this.addUserActionsToComments(commentsWithUserActions);
            this.loadedComments = commentsWithUserActions;
          },
          error: (errorResponse: HttpErrorResponse): void => {
            if (errorResponse && errorResponse.message) this._snackBar.open(errorResponse.message, 'X', {panelClass: ['invalid']});
            if (errorResponse && errorResponse.error && errorResponse.error.message) this._snackBar.open(errorResponse.error.message, 'X', {panelClass: ['invalid']});
          }
        });
    }
  }

  private convertCommentResponseToCommentWithUserAction(comments: CommentsResponseType): CommentWithUserActionType[] {
    // Add field 'userAction' to comment object
    const newLoadedCommentsWithUserActionTyp: CommentWithUserActionType[] = [];
    if (comments.comments.length > 0) {
      comments.comments.forEach((comment: CommentType): void => {
        newLoadedCommentsWithUserActionTyp.push({
          id: comment.id,
          text: comment.text,
          date: comment.date,
          likesCount: comment.likesCount,
          dislikesCount: comment.dislikesCount,
          user: comment.user,
          userAction: '',
        });
      });
    }
    return newLoadedCommentsWithUserActionTyp;
  }

  private addNewComments(currentComments: CommentWithUserActionType[], newComments: CommentWithUserActionType[]): CommentWithUserActionType[] {
    const updatedLoadedComments: CommentWithUserActionType[] = currentComments;
    const newCommentsCount: number = newComments.length;

    for (let i: number = 0; i < newCommentsCount; i++) {
      const comment: CommentWithUserActionType = newComments[i];
      if (comment) {
        updatedLoadedComments.push({
          id: comment.id,
          text: comment.text,
          date: comment.date,
          likesCount: comment.likesCount,
          dislikesCount: comment.dislikesCount,
          user: comment.user,
          userAction: comment.userAction,
        });
      } else {
        break;
      }
    }
    return updatedLoadedComments;
  }

  private addUserActionsToComments(loadedComments: CommentWithUserActionType[]): CommentWithUserActionType[] {
    const loadedCommentsWithUserActions: CommentWithUserActionType[] = loadedComments;
    this.userCommentsActions.forEach((action: CommentsUserArticleActionsType): void => {
      loadedCommentsWithUserActions.map((comment: CommentWithUserActionType): CommentWithUserActionType => {
        if (comment.id === action.comment) {
          if (action.action) comment.userAction = action.action;
        }
        return comment;
      });
    });
    return loadedCommentsWithUserActions;
  }

  public loadMoreComments(): void {
    if (this.loadedComments.length > 0 && this.currentArticleData) {
      const currentLoadedCommentsCount: number = this.loadedComments.length;

      if (currentLoadedCommentsCount !== this.totalCommentsCount) {
        this.commentService.getComments(currentLoadedCommentsCount, this.currentArticleData.id)
          .subscribe((comments: CommentsResponseType): void => {
            if (comments.comments.length > 0) {
              this.isCommentsLoadingNow = true;
              this.totalCommentsCount = comments.allCount;

              let newComments: CommentWithUserActionType[] = this.convertCommentResponseToCommentWithUserAction(comments);
              // If user is authorized - update comments with 'possibly user's actions'
              if (this.isUserLoggedIn && this.userCommentsActions.length > 0) newComments = this.addUserActionsToComments(newComments);

              setTimeout((): void => {
                this.isCommentsLoadingNow = false;
                this.loadedComments = this.addNewComments(this.loadedComments, newComments);
              }, 500);
            }
          });
      }
    }
  }

  public addComment(): void {
    if (this.commentGroup.valid && this.commentGroup.value.text && this.currentArticleData) {
      this.commentService.addComment(this.commentGroup.value.text, this.currentArticleData.id)
        .subscribe({
          next: (response: DefaultResponseType): void => {
            this.commentGroup.reset();
            this._snackBar.open(response.message, 'X', {panelClass: ['success']});

            // INITIALLY - get 10 comments (max.) then trim to 3 elements
            // Update user's actions for article's comments
            this.commentService.getComments(0, this.currentArticleData!.id)
              .subscribe((comments: CommentsResponseType): void => {
                // Show last 3 comments
                if (comments.comments.length > 0) {
                  this.totalCommentsCount = comments.allCount;
                  // If user is authorized
                  if (this.isUserLoggedIn && this.currentArticleData) this.requestAndUpdateUserActions(comments);
                  // If user is unauthorized
                  else this.loadedComments = (this.convertCommentResponseToCommentWithUserAction(comments)).slice(0, 3);
                }
              });
          },
          error: (errorResponse: HttpErrorResponse): void => {
            // Generated error in 'commentService.addComment'
            if (errorResponse && errorResponse.message) this._snackBar.open(errorResponse.message, 'X', {panelClass: ['invalid']});
            // Error from server
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open('Произошла ошибка! Пожалуйста авторизуйтесь и попробуйте снова.', 'X', {panelClass: ['invalid']});

              this.authService.logout();
              this.authService.removeTokens();
              this.authService.removeUserInfo();
            }
          }
        });
    }
  }

  public commentAction(actionType: string, comment: CommentWithUserActionType): void {
    if (this.isUserLoggedIn) {
      this.commentService.applyUserAction(actionType, comment.id)
        .subscribe({
          next: (response: DefaultResponseType): void => {
            console.log(response);
            if (!response.error) {
              if ((actionType === 'like') || (actionType === 'dislike')) {
                // Request user action for this comment - to make sure that everything is correct
                this.commentService.getCommentAction(comment.id)
                  .subscribe((userActionForComment:CommentsUserArticleActionsType[] | DefaultResponseType): void => {
                    if (Array.isArray((userActionForComment as CommentsUserArticleActionsType[]))) {
                      this._snackBar.open('Ваш голос учтен.', 'X', {panelClass: ['success']});
                      this.updateCommentWithUserAction(comment, userActionForComment as CommentsUserArticleActionsType[]);
                    }
                  });
              }
              if (actionType === 'violate') {
                this._snackBar.open('Жалоба отправлена.', 'X', {panelClass: ['success']});
              }
            } else {
              this._snackBar.open(response.message, 'X', {panelClass: ['invalid']});
            }
          },
          error: (errorResponse: HttpErrorResponse): void => {
            if ((actionType === 'violate') && (errorResponse.status === 400)) {
              this._snackBar.open(errorResponse.error.message, 'X', {panelClass: ['invalid']});
            }
            if ((actionType === 'like') || (actionType === 'dislike')) {
              if (errorResponse.status === 500) this._snackBar.open('Ошибка! Не удалось оставить реакцию', 'X', {panelClass: ['invalid']});
              else if (errorResponse) this._snackBar.open(errorResponse.message, 'X', {panelClass: ['invalid']});
            }
          }
        });
    } else {
      this._snackBar.open('Оставлять реакцию могут только авторизованные пользователи!', 'X', {panelClass: ['invalid']});
    }
  }

  private updateCommentWithUserAction(comment: CommentWithUserActionType, response: CommentsUserArticleActionsType[]): void {
    const currentUserAction: string = comment.userAction;
    const selectedActionFromResponse: string | [] = response[0] ? response[0].action : [];

    if (!currentUserAction && selectedActionFromResponse) {
      if (selectedActionFromResponse === 'like') {
        comment.likesCount++;
        comment.userAction = 'like';
      }
      if (selectedActionFromResponse === 'dislike') {
        comment.dislikesCount++;
        comment.userAction = 'dislike';
      }
    }

    if (currentUserAction) {
      if ((currentUserAction === 'like') && (selectedActionFromResponse.length === 0)) {
        comment.userAction = '';
        comment.likesCount--;
      }
      if ((currentUserAction === 'like') && (selectedActionFromResponse === 'dislike')) {
        comment.userAction = 'dislike';
        comment.likesCount--;
        comment.dislikesCount++;
      }
      if ((currentUserAction === 'dislike') && (selectedActionFromResponse.length === 0)) {
        comment.userAction = '';
        comment.dislikesCount--;
      }
      if ((currentUserAction === 'dislike') && (selectedActionFromResponse === 'like')) {
        comment.userAction = 'like';
        comment.dislikesCount--;
        comment.likesCount++;
      }
    }
  }

  public getUserCommentsState(): string {
    if (!this.isUserLoggedIn && this.loadedComments.length === 0) return 'uUnauth-noCom';
    if (!this.isUserLoggedIn && this.loadedComments.length > 0) return 'uUnauth-com';
    if (this.isUserLoggedIn && this.loadedComments.length === 0) return 'uAuth-noCom';
    return 'uAuth-com';
  }
}
