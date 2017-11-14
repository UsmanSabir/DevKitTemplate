import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { AccountRoutingModule } from './account-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [RouterModule, AccountRoutingModule, SharedModule, FormsModule,  ReactiveFormsModule],
    exports: [],
    declarations: [LoginComponent, AccountComponent, RegisterComponent],
    providers: [],
})
export class AccountModule { }
