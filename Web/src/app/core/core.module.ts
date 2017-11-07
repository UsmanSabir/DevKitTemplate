import { NgModule } from '@angular/core';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [FooterComponent,
        NavbarComponent,
        SidebarComponent],
    declarations: [FooterComponent,
        NavbarComponent,
        SidebarComponent],
    providers: [],
})
export class CoreModule { }
