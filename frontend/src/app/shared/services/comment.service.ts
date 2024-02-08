import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {CommentsResponseType} from "../../../types/comments-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentsUserArticleActionsType} from "../../../types/comments-user-article-actions.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http: HttpClient = inject(HttpClient);
  public getComments(offset: number, articleUrl: string): Observable<CommentsResponseType> {
    return this.http.get<CommentsResponseType>(environment.api + 'comments', { params: { offset: offset, article: articleUrl }});
  }

  public addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', { text, article });
  }

  public getArticleCommentActions(articleId: string): Observable<CommentsUserArticleActionsType[] | DefaultResponseType> {
    return this.http.get<CommentsUserArticleActionsType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions', { params: { articleId }});
  }

  public getCommentAction(commentId: string): Observable<CommentsUserArticleActionsType[] | DefaultResponseType> {
    return this.http.get<CommentsUserArticleActionsType[] | DefaultResponseType>(environment.api + `comments/${commentId}/actions`);
  }

  public applyUserAction(action: string, commentId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + `comments/${commentId}/apply-action`, { action });
  }
}
