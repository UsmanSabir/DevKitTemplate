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
    FormsModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
