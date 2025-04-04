import { NgModule } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/page/dashboard.component';
import { NavbarComponent } from './dashboard/components/navbar/navbar.component';
import { HeaderComponent } from './dashboard/components/header/header.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardChartComponent } from './dashboard/components/chart/chart.component';
import { CardComponent } from './dashboard/components/card/card.component';
@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    HeaderComponent,
    DashboardChartComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    NgApexchartsModule,
  ],
  providers: [
    provideClientHydration()
  ],
})
export class AppModule { }
