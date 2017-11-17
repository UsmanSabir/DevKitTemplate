import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AdminModule } from './admin/admin.module';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import { AppConfig } from './shared/app.config';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import { JwtModule } from '@auth0/angular-jwt';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule, 
    AdminModule,
    CoreModule,
    FormsModule, ReactiveFormsModule,
    SnotifyModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['localhost:5000']
      }
    })
  ],
  providers: [{ provide: 'SnotifyToastConfig', useValue: ToastDefaults},
  SnotifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
