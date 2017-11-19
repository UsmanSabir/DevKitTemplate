import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/toast.service';

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
    private authService: AuthService) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(): void {

    this.spinnerService.show();
    this.loading = true;
    this.authService.login(this.model.username, this.model.password,
      () => {
        this.loading = false;
        this.spinnerService.hide();
      },
      this.returnUrl
    );
  }


}
