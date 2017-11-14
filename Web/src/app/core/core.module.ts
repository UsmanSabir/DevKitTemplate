import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtHelper } from 'angular2-jwt';

@NgModule({
    imports: [CommonModule, RouterModule, ],
    exports: [CommonModule],
    declarations: [],
    providers: [AuthService, AuthGuard, JwtHelper],
})
export class CoreModule { }
