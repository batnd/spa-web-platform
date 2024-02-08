import {inject, Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokens: { accessToken: string | null, refreshToken: string | null } = this.authService.getTokens();
    if (tokens && tokens.accessToken) {
      const authReq: HttpRequest<any> = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken)
      });
      return next.handle(authReq)
        .pipe(
          catchError((error) => {
            if (error.status === 500 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
              return this.handle500Error(authReq, next);
            }
            return throwError(() => error);
          })
        );
    }
    return next.handle(req);
  }

  private handle500Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refresh()
      .pipe(
        switchMap((result: DefaultResponseType | LoginResponseType) => {
          let error: string = '';
          if ((result as DefaultResponseType).error !== undefined) error = (result as DefaultResponseType).message;

          const refreshResult: LoginResponseType = result as LoginResponseType;
          if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) error = 'Ошибка авторизации';

          if (error) return throwError(() => new Error(error));

          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);

          const authReq: HttpRequest<any> = req.clone({
            headers: req.headers.set('x-auth', refreshResult.accessToken)
          });
          return next.handle(authReq);
        }),
        catchError(error => {
          if (error.status !== 400) {
            this.authService.removeTokens();
            this.router.navigate(['/']);
          }
          return throwError(() => error);
        })
      );
  }
}
