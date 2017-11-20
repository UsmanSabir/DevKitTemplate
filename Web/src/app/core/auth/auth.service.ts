import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/user.model';
import { LocalStorageService } from '../local-storage.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { ToastService } from '../toast.service';
import { LoggerService } from '../logger.service';
import { AppConfig } from '../../shared/config/app.config';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwtHelperService } from './jwthelper.service';

@Injectable()
export class AuthService {


  // Create a stream of logged in status to communicate throughout app
  isloggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.isloggedIn);


  constructor(private router: Router, private toastService: ToastService, private logger: LoggerService,
    // private localStorageService: LocalStorageService, 
    private httpClient: HttpClient, private jwtHelper: JwtHelperService,
    private oAuthService: OAuthService) {
    // If authenticated, set local profile property and update login status subject
    if (this.authenticated) {
      this.setLoggedIn(true);
    }
  }

  // https://github.com/auth0/angular2-jwt
  public loggedIn(): boolean {

    const hasIdToken = this.oAuthService.hasValidIdToken();
    const hasAccessToken = this.oAuthService.hasValidAccessToken();

    return (hasIdToken && hasAccessToken);

    // const token = localStorage.getItem('token');
    // if (token) {
    //   return true;
    // } else {
    //   return false;
    // }
    // // Check whether the token is expired and return
    // // true or false
    // return !this.jwtHelper.isTokenExpired(token);

    // return tokenNotExpired();
  }

  get authenticated() {
    // Check if there's an unexpired access token
    return this.loggedIn(); // tokenNotExpired('token');
  }


  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.isloggedIn = value;
  }



  login(username: string, password: string, callback: () => void, returnUrl?: string) {


    this.oAuthService.fetchTokenUsingPasswordFlow(username, password)
      .then((x: any) => {

        const claims = this.oAuthService.getIdentityClaims();
        if (claims) {console.log('given_name', claims['given_name']); }

        localStorage.setItem('id_token', x.id_token);
        // this.oAuthService.setupAutomaticSilentRefresh(); // for implict flow

        this.setLoggedIn(true);
        callback();

        if (returnUrl) {
          this.router.navigate([returnUrl]);
        } else {
          this.router.navigate(['/']);
        }
      })
      .catch(error => {

        callback();

        this.logger.error(error);

        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          this.logger.log('An error occurred:', error.error.message);
          this.toastService.showError('Error connecting server. Try again...');
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          this.logger.log(`Backend returned code ${error.status}, body was: ${error.error}`); // statusText
          this.toastService.showError(`Login failed.\n ${error.error.error_description}`);
        }

      })
      .then((x: any) => {
        callback();
        this.logger.log('finally called');
      })
      ;



    // const body = { username: username, password: password };
    // return this.httpClient.post<User>(AppConfig.apiAuthLoginUrl, body)

    //   .subscribe(
    //   data => {

    //     this.logger.log(data);
    //     if (data && data.token) {
    //       // store user details and jwt token in local storage to keep user logged in between page refreshes
    //       localStorage.setItem('token', JSON.stringify(data.token));
    //       localStorage.setItem('user', JSON.stringify(data)); // set user profile

    //       this.setLoggedIn(true);

    //       if (redirectUrl) {
    //         this.router.navigate([redirectUrl]);
    //       } else {
    //         this.router.navigate(['/']);
    //       }
    //     }
    //   },
    //   error => {
    //     callback();
    //     this.logger.error(error);
    //     if (error.error instanceof Error) {
    //       // A client-side or network error occurred. Handle it accordingly.
    //       this.logger.log('An error occurred:', error.error.message);
    //       this.toastService.showError('Cannot reach server. Try again...');
    //     } else {
    //       // The backend returned an unsuccessful response code.
    //       // The response body may contain clues as to what went wrong,
    //       this.logger.log(`Backend returned code ${error.status}, body was: ${error.error}`); // statusText
    //       this.toastService.showError(`Login failed.`);
    //     }
    //   },
    //   () => {
    //     this.logger.log('Request Complete');
    //     callback();
    //   });

  }

  logout(callback?: () => void, redirectUrl?: string) {

    this.httpClient.post(AppConfig.apiAuthLogOutUrl, '').subscribe((res) => {
      this.oAuthService.logOut();
      this.setLoggedIn(false);

      if (callback) {
        callback();
      }
      if (redirectUrl) {
        this.router.navigate([redirectUrl]);
      } else {
        this.router.navigate(['account/login']);
      }
    }, err => {
      this.logger.error(err);
      if (callback) {
        callback();
      }
      if (redirectUrl) {
        this.router.navigate([redirectUrl]);
      } else {
        this.router.navigate(['account/login']);
      }
    });
    // this.oAuthService.logOut();

    // // remove user from local storage to log user out
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    // this.setLoggedIn(false);


    // if (redirectUrl) {
    //   this.router.navigate([redirectUrl]);
    // } else {
    //   this.router.navigate(['/']);
    // }
  }

  public get name() {
    const payLoad = this.jwtHelper.decodeToken(this.getAccessToken());
    if (payLoad) {
      return payLoad.name;
    }
    const claims: any = this.oAuthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    return claims.given_name;
  }

  loadUserProfile(): void {
    this
      .oAuthService
      .loadUserProfile()
      .then(up => this.logger.log(up));

  }

  getAccessToken() {
    const token = this.oAuthService.getAccessToken(); // .getIdToken(); // .getAccessToken();
    return token;
  }

  test(callback?: () => void, redirectUrl?: string) {

//     this.oAuthService.refreshToken().then(() => {
//       console.log('refresh ok');
// });

    const expiration = this.oAuthService.getAccessTokenExpiration();
    console.log('expiry: ' + expiration);

    this.httpClient.get(AppConfig.apiTestUrl).subscribe((res) => {
      this.logger.log(res);
    }, err => {
      this.logger.error(err);
      this.logger.log(err);
    });

  }

}
