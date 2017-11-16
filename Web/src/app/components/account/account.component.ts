import { Component, OnInit } from '@angular/core';
import '../../../assets/js/material-kit.js';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
    if(this.authService.authenticated){
      this.router.navigate(['/']);
    }
   }

  ngOnInit() {
  }

}
