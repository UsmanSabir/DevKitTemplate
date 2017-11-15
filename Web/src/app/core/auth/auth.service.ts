import { Injectable } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AppConfig } from '../../shared/app.config';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user.model';
import { LocalStorageService } from '../local-storage.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  
// Create a stream of logged in status to communicate throughout app
isloggedIn: boolean;
loggedIn$ = new BehaviorSubject<boolean>(this.isloggedIn);


  constructor(public jwtHelper: JwtHelper, private router: Router,
    private httpClient: HttpClient, private localStorageService: LocalStorageService) {
      // If authenticated, set local profile property and update login status subject
    if (this.authenticated) {
      this.setLoggedIn(true);
    }
    }

  // https://github.com/auth0/angular2-jwt
  public loggedIn(): boolean {
    // const token = localStorage.getItem('token');
    // // Check whether the token is expired and return
    // // true or false
    // return !this.jwtHelper.isTokenExpired(token);

    return tokenNotExpired();
  }

  get authenticated() {
    // Check if there's an unexpired access token
    return tokenNotExpired('token');
  }


  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.isloggedIn = value;
  }



  login(username: string, password: string, callback: () => void, redirectUrl?: string) {
    
          const body = {username: username, password: password };
          return this.httpClient.post<User>(AppConfig.apiAuthLoginUrl, body)
          
          .subscribe(
              data=>{
                callback();
                console.log(data);
                if (data && data.token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('token', JSON.stringify(data.token));
                  this.setLoggedIn(true);

                  if(redirectUrl){
                    this.router.navigate([redirectUrl]);
                 } else {
                    this.router.navigate(['/']);
                 }
              }
              },
              error=>{
                callback();
                console.error(error);
              });
                
            }
      
         logout(redirectUrl:string) {
             // remove user from local storage to log user out
             localStorage.removeItem('token');
             this.setLoggedIn(false);

            
             if(redirectUrl){
                this.router.navigate([redirectUrl]);
             } else {
                this.router.navigate(['/']);
             }
         }
      
}
