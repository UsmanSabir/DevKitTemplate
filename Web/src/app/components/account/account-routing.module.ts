import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';


// const routes: Routes = [
//   { path: 'path', component: AccountComponent },
// ];

@NgModule({
  imports: [
      RouterModule.forChild([
          {
              path: '',
              component: AccountComponent,
              children: [
                  { path: '', redirectTo: 'login', pathMatch: 'full' },
                  { path: 'login', component: LoginComponent },
                  { path: 'register', component: RegisterComponent }
              ]
          }
      ])
  ],
  exports: [
      RouterModule
  ]
})
export class AccountRoutingModule { }
