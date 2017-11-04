import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditLogListComponent } from './auditlog-list/auditlog-list.component';


const routes: Routes = [
  { path: 'path', component: AuditLogListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditLogRoutingModule { }

export const routedComponents = [AuditLogListComponent];
