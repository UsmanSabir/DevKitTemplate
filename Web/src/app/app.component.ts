import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import { OAuthService, JwksValidationHandler, OAuthInfoEvent } from 'angular-oauth2-oidc';
import { authConfig } from './shared/config/auth.config';
import { AppConfig } from './shared/config/index';
import { LoggerService } from './core/logger.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  url: string;

  constructor(private oauthService: OAuthService, private router: Router, private logger: LoggerService) {
    this.configureOidc();
  }


  ngOnInit() {
    this.url = this.router.url;
  }

  private configureOidc() {

    this.oauthService.configure(authConfig(this.url));
    this.oauthService.setStorage(localStorage);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    // this.oauthService.oidc = false;
    // this.oauthService.useIdTokenHintForSilentRefresh = true;
    // this.oauthService.setupAutomaticSilentRefresh();
    this.hookEvent();
    if (this.oauthService.hasValidAccessToken()) {
      (<any>this.oauthService).setupExpirationTimers(); // a HACK
    }
    // Load Discovery Document and then try to login the user
    const discvryUrl = AppConfig.apiUrl + '/.well-known/openid-configuration';
    this.oauthService.loadDiscoveryDocument(discvryUrl).then(() => {
      // Do what ever you want here
      this.logger.log('Auth discovery complete');
      // if (this.oauthService.hasValidAccessToken()) {
      //   (<any>this.oauthService).setupExpirationTimers(); //setupRefreshTimer(); // a hack
      // }
    });
    // this.oauthService.loadDiscoveryDocumentAndTryLogin(discvryUrl);

    this.oauthService.tryLogin({
      onTokenReceived: function (context) {
        console.log('logged in');
        console.log(context);
      },
    });
  }

  private hookEvent() {
    this.oauthService.events.subscribe((e) => {

      if (e instanceof OAuthInfoEvent && e.type === 'token_expires') {
        this.logger.debug('token expires. sending refresh_token command');
        this.oauthService.refreshToken().then(() => {
          this.logger.debug('token refresh ok');
        })
          .catch(err => this.logger.error('refresh error', err));
      }

    });
  }
}
