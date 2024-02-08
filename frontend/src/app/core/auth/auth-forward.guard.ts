import {CanActivateFn} from '@angular/router';
import {AuthService} from "./auth.service";
import {inject} from "@angular/core";
import {Location} from "@angular/common";

export const authForwardGuard: CanActivateFn = (): boolean => {
  const authService: AuthService = inject(AuthService);
  const location: Location = inject(Location);
  const isUserLoggedIn: boolean = authService.getIsLoggedIn();

  if (isUserLoggedIn) {
    location.back();
    return false;
  }
  return true;
};
