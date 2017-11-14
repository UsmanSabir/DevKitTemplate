import { NgModule } from '@angular/core';

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [RouterModule, AdminRoutingModule, SharedModule],
    exports: [],
    declarations: [AdminComponent, DashboardComponent, FooterComponent,
        NavbarComponent,
        SidebarComponent],
    providers: [],
})
export class AdminModule { }
