import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './components/account/account.component';


const routes: Routes = [
   // { path: 'dashboard',      component: DashboardComponent },
      { path: '',          redirectTo: 'main/dashboard', pathMatch: 'full' },
      {
        path: 'account',
        loadChildren: './components/account/account.module#AccountModule', // Lazy load account module
        data: { preload: true }
    },
    {
      path: 'main',
      loadChildren: './main/main.module#MainModule', // Lazy load admin module
      data: { preload: true }
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
