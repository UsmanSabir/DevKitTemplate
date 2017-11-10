import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
    imports: [RouterModule, AccountRoutingModule],
    exports: [],
    declarations: [LoginComponent, AccountComponent, RegisterComponent],
    providers: [],
})
export class AccountModule { }
