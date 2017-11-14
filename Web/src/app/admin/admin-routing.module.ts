import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../core/auth/auth.guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminComponent, canActivate: [AuthGuard],
                children: [
                    // { path: 'auditLogs', component: AuditLogsComponent, data: { permission: 'Pages.Administration.AuditLogs' } },
                     { path: '',  redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: 'dashboard', component: DashboardComponent}
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule { }
