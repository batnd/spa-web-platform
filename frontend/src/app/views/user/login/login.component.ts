import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {emailValidationRegexp} from "../../../../regexp/form-validation-regex";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);
  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(emailValidationRegexp)]],
    password: ['', [Validators.required]],
    agree: [false]
  });
  public loginFailed: boolean = false;
  public entranceSuccessful: boolean = false;
  public isPasswordShown: boolean = false;

  public login(): void {
    const formIsValid: boolean = this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password;
    if (formIsValid) {
      this.loginFailed = false;
      this.entranceSuccessful = false;

      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, this.loginForm.value.agree)
        .subscribe({
          next: (response: DefaultResponseType | LoginResponseType): void => {
            let error: string | null = null;
            if ((response as DefaultResponseType).error !== undefined) error = (response as DefaultResponseType).message;

            const loginResponse: LoginResponseType = response as LoginResponseType;
            if (!loginResponse.refreshToken || !loginResponse.accessToken || !loginResponse.userId) error = 'Ошибка авторизации';

            if (error) {
              this._snackBar.open(error, 'X', {panelClass: ['invalid']});
              return;
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.setUserId(loginResponse.userId);
            this.loginForm.reset();
            this._snackBar.open('Вы успешно авторизованы!', 'X', {panelClass: ['success']});
            this.entranceSuccessful = true;

            setTimeout((): void => {
              this.router.navigate(['/']);
            }, environment.redirectTimeout);
          },
          error: (error: HttpErrorResponse): void => {
            this.loginFailed = true;
            if (error.error && error.error.message) this._snackBar.open(error.error.message, 'X', {panelClass: ['invalid']});
            else this._snackBar.open('Ошибка авторизации!', 'X', {panelClass: ['invalid']});
          }
        });
    } else {
      this._snackBar.open('Пожалуйста, заполните все поля корректно!', 'X', {panelClass: ['invalid']});
      return;
    }
  }

  public passwordShowingToggle(): void {
    this.isPasswordShown = !this.isPasswordShown;
  }
}
