import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable, Subject, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {GetUserInfoResponseType} from "../../../types/get-user-info-response.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private accessToken: string = 'accessToken';
  private refreshToken: string = 'refreshToken';
  private userId: string = 'userId';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor() {
    this.isLogged = !!localStorage.getItem(this.accessToken);
  }

  public getUserInfo(): Observable<DefaultResponseType | GetUserInfoResponseType> {
    return this.http.get<DefaultResponseType | GetUserInfoResponseType>(environment.api + 'users');
  }

  public signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name,
      email,
      password
    });
  }

  public login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email,
      password,
      rememberMe
    });
  }

  public logout(): Observable<DefaultResponseType> {
    const tokens: { accessToken: string | null, refreshToken: string | null } = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + '/logout', {
        refreshToken: tokens.refreshToken
      });
    }
    // Если в локальном хранилище нет токенов
    return throwError(() => "Can not find token");
  }

  public refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens: { accessToken: string | null, refreshToken: string | null } = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {refreshToken: tokens.refreshToken});
    }
    throw throwError(() => 'Can not use token');
  }

  public getIsLoggedIn(): boolean {
    return this.isLogged;
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessToken, accessToken);
    localStorage.setItem(this.refreshToken, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessToken),
      refreshToken: localStorage.getItem(this.refreshToken)
    };
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.accessToken);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessToken);
    localStorage.removeItem(this.refreshToken);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public setUserId(id: string): void {
    if (id) localStorage.setItem(this.userId, id);
    else localStorage.removeItem(id);
  }

  public removeUserInfo(): void {
    localStorage.removeItem(this.userId);
  }
}
