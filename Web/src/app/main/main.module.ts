import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

@NgModule({
    imports: [RouterModule, MainRoutingModule, SharedModule],
    exports: [],
    declarations: [MainComponent, DashboardComponent, FooterComponent,
        NavbarComponent,
        SidebarComponent],
    providers: [],
})
export class MainModule { }
