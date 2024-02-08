import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  emailValidationRegexp,
  nameValidationRegexp,
  passwordValidationRegexp
} from "../../../../regexp/form-validation-regex";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);
  public signupForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(nameValidationRegexp)]],
    email: ['', [Validators.required, Validators.pattern(emailValidationRegexp)]],
    password: ['', [Validators.required, Validators.pattern(passwordValidationRegexp)]],
    agree: [false, [Validators.requiredTrue]]
  });
  public signupFailed: boolean = false;
  public signupSuccessful: boolean = false;
  public isPasswordShown: boolean = false;

  public signup(): void {
    if (this.signupForm.valid
      && this.signupForm.value.name
      && this.signupForm.value.email
      && this.signupForm.value.password
      && this.signupForm.value.agree) {
      this.signupFailed = false;
      this.signupSuccessful = false;

      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (response: LoginResponseType | DefaultResponseType): void => {
            let error: string | null = null;
            if ((response as DefaultResponseType).error !== undefined) error = (response as DefaultResponseType).message;

            const loginResponse: LoginResponseType = response as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) error = 'Ошибка авторизации!';

            if (error) {
              this.signupFailed = true;
              this._snackBar.open(error, 'X', {panelClass: 'invalid'});
              return;
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.setUserId(loginResponse.userId);
            this._snackBar.open(`${this.signupForm.value.name}, вы успешно зарегистрировались в АйтиШторм!`, 'X', {panelClass: 'success'});
            this.signupForm.reset();
            this.signupSuccessful = true;

            setTimeout(() => {
              this.router.navigate(['/']);
            }, environment.redirectTimeout);
          },
          error: (error: HttpErrorResponse): void => {
            this.signupFailed = true;
            if (error.error && error.error.message) this._snackBar.open('Ошибка! ' + error.error.message, 'X', {panelClass: 'invalid'});
            else this._snackBar.open('Ошибка регистрации! Попробуйте снова.', 'X', {panelClass: 'invalid'});
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
