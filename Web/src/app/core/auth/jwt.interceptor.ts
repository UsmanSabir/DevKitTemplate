import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { JwtHelperService } from './jwthelper.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import { LoggerService } from '../logger.service';

// Adapted from https://github.com/auth0/angular2-jwt/blob/v1.0/src/jwt.interceptor.ts

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  tokenGetter: () => string | Promise<string>;
  headerName: string;
  authScheme: string;
  skipWhenExpired = false;

  constructor(
    public jwtHelper: JwtHelperService, private logger: LoggerService
  ) {
    this.tokenGetter = this.getTokenFromLocalStorage;
    this.headerName = 'Authorization';
    this.authScheme = 'Bearer ';

  }

  private getTokenFromLocalStorage() {
    const token = JSON.parse(localStorage.getItem('token'));
    return token;
  }

  handleInterception(
    token: string,
    request: HttpRequest<any>,
    next: HttpHandler
  ) {
    let tokenIsExpired: boolean;

    if (this.skipWhenExpired) {
      tokenIsExpired = token ? this.jwtHelper.isTokenExpired(token) : true;
    }

    if (token && tokenIsExpired && this.skipWhenExpired) {
      request = request.clone();
    } else if (token) {
      request = request.clone({
        setHeaders: {
          [this.headerName]: `${this.authScheme}${token}`
        }
      });
    }
    return next.handle(request)
    .do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // do stuff with response if you want
            }
          }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                // redirect to the login route
                // or show a modal
                this.logger.error('Request failed - User not authorized');
              }
            }
          }
    );
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: any = this.tokenGetter();

    if (token instanceof Promise) {
      return Observable.fromPromise(token).mergeMap((asyncToken: string) => {
        return this.handleInterception(asyncToken, request, next);
      });
    } else {
      return this.handleInterception(token, request, next);
    }
  }
}
