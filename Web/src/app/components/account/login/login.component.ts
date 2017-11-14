import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../../core/spinner/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  model: any = {};
  
  constructor(private spinnerService: SpinnerService) { }

  ngOnInit() {
  }

  login(): void {
    this.spinnerService.show();
    
    this.loading = true;
    // this.loginService.authenticate(
    //     () => this.loading = false
    // );

    console.log(this.model);
}


}
