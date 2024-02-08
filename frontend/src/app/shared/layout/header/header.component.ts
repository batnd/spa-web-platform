import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {GetUserInfoResponseType} from "../../../../types/get-user-info-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {IsActiveMatchOptions} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  public isLoggedIn: boolean = false;
  public userName: string = '';

  public otherLinkActiveOptions: IsActiveMatchOptions = {
    matrixParams: 'exact',
    queryParams: 'exact',
    paths: 'exact',
    fragment: 'exact',
  };
  public articlesOptionsLinkActive: IsActiveMatchOptions = {
    matrixParams: 'exact',
    queryParams: 'subset',
    paths: 'subset',
    fragment: 'exact',
  };

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    if (this.isLoggedIn) this.getUserInfo();

    this.authService.isLogged$
      .subscribe((isLogged: boolean): void => {
        this.isLoggedIn = isLogged;
        if (this.isLoggedIn) this.getUserInfo();
      });
  }

  private getUserInfo(): void {
    this.authService.getUserInfo()
      .subscribe({
        next: (response: DefaultResponseType | GetUserInfoResponseType): void => {
          this.userName = (response as GetUserInfoResponseType).name;
        },
        error: (): void => {
          this.doLogout();
        }
      });
  }

  public logout(): void {
    this.authService.logout().subscribe(() => this.doLogout());
  }

  private doLogout(): void {
    this.authService.removeTokens();
    this.authService.removeUserInfo();
    this._snackBar.open('Вы успешно вышли из системы!');
  }
}
