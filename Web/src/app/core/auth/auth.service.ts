import { Injectable } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthService {

  constructor(public jwtHelper: JwtHelper) {}

  // https://github.com/auth0/angular2-jwt
  public loggedIn(): boolean {
    // const token = localStorage.getItem('token');
    // // Check whether the token is expired and return
    // // true or false
    // return !this.jwtHelper.isTokenExpired(token);

    return tokenNotExpired();
  }
}
