import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/toast.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { LoggerService } from '../../../core/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading = false;
  model: any = {};
  returnUrl: string;

  constructor(private spinnerService: SpinnerService, private route: ActivatedRoute,
    private authService: AuthService, private oAuthService: OAuthService, private logger: LoggerService,
    private router: Router, private toastService: ToastService) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(): void {

    this.spinnerService.show();
    this.loading = true;

    // this.oAuthService.fetchTokenUsingPasswordFlow(this.model.username, this.model.password)
    // .then((x: any) => {
    //     localStorage.setItem('token', x.id_token);
    //     this.oAuthService.setupAutomaticSilentRefresh();

    //     this.loading = false;
    //     this.spinnerService.hide();

    //     if (this.returnUrl) {
    //         this.router.navigate([this.returnUrl]);
    //       } else {
    //         this.router.navigate(['/']);
    //       }
    // })
    // .catch(error => {

    //   this.loading = false;
    //   this.spinnerService.hide();

    //   this.logger.error(error);

    //   if (error.error instanceof Error) {
    //     // A client-side or network error occurred. Handle it accordingly.
    //     this.logger.log('An error occurred:', error.error.message);
    //     this.toastService.showError('Error connecting server. Try again...');
    //   } else {
    //     // The backend returned an unsuccessful response code.
    //     // The response body may contain clues as to what went wrong,
    //     this.logger.log(`Backend returned code ${error.status}, body was: ${error.error}`); // statusText
    //     this.toastService.showError(`Login failed.\n ${error.error.error_description}`);
    //   }

    // });



    this.authService.login(this.model.username, this.model.password,
      () => {
        this.loading = false;
        this.spinnerService.hide();
      },
      this.returnUrl
    );
  }

  googleLogin() {
    this.oAuthService.initImplicitFlow(null, { provider: 'google' });
  }

}
