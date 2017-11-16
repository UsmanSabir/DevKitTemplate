import { FormsModule }   from '@angular/forms';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtHelper } from 'angular2-jwt';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerService } from './spinner/spinner.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { LoggerService } from './logger.service';
import { LocalStorageService } from './local-storage.service';
import { ToastService } from './toast.service';

@NgModule({
    imports: [CommonModule, RouterModule ],
    exports: [SpinnerComponent],
    declarations: [SpinnerComponent],
    providers: [AuthService, AuthGuard, JwtHelper, SpinnerService, LoggerService, LocalStorageService, ToastService],
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
      }
 }
