import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  model: any = {};
  returnUrl: string;
  
  constructor(private spinnerService: SpinnerService, private route: ActivatedRoute, private loginService: AuthService) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(): void {
    this.spinnerService.show();    
    this.loading = true;
    this.loginService.login(this.model.username, this.model.password,
        () => {
          this.loading = false;
          this.spinnerService.hide();   
        },
        this.returnUrl
    );

    console.log(this.model);
}


}
