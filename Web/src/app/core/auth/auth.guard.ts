import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { JwtHelperService } from './jwthelper.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private jwtHelper: JwtHelperService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const isLoggedIn = this.auth.loggedIn();
    if (isLoggedIn) {
      const expectedRole = next.data.expectedRole;
      const token =  this.auth.getAccessToken(); // localStorage.getItem('token');
      // decode the token to get its payload


      //  const tokenPayload = this.jwtHelper.decodeToken(token);
      //  if (tokenPayload.role !== expectedRole) {
      //      isLoggedIn = false;
      //    }
    }

    if (!isLoggedIn) {
      this.router.navigate(['account/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    return true;
  }
}
