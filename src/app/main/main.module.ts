import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/component/dashboard.component';
import { NavbarComponent } from './dashboard/components/navbar/navbar.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
})
export class AppModule { }
