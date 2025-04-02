import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/component/dashboard.component';
import { NavbarComponent } from './dashboard/components/navbar/navbar.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatGridListModule,
    MatButtonModule,
    MatCardModule
  ],
  providers: [
    provideClientHydration()
  ],
})
export class AppModule { }
