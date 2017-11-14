import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  model: any = {};
  
  constructor(private spinnerService: SpinnerService, private loginService: LoginService) { }

  ngOnInit() {
  }

  login(): void {
    this.spinnerService.show();    
    this.loading = true;
    this.loginService.login(this.model.username, this.model.password,
        () => {
          this.loading = false;
          this.spinnerService.hide();   
        }
    );

    console.log(this.model);
}


}
