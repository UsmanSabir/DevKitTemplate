import { FormsModule } from '@angular/forms';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerService } from './spinner/spinner.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { LoggerService } from './logger.service';
import { LocalStorageService } from './local-storage.service';
import { ToastService } from './toast.service';
import { JwtHelperService } from './auth/jwthelper.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './auth/jwt.interceptor';

@NgModule({
    imports: [CommonModule, RouterModule, HttpClientModule],
    exports: [SpinnerComponent],
    declarations: [SpinnerComponent],
    providers: [AuthService, AuthGuard, SpinnerService, LoggerService, LocalStorageService, ToastService,
        JwtHelperService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
          }],
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
