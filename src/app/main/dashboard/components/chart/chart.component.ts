import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { QuotesValues } from '@app/core/models';
import { ChartOptions } from '@core/types';
import { ChartComponent } from "ng-apexcharts";

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrl: './chart.component.scss',
    standalone: false
})
export class DashboardChartComponent implements AfterViewInit {
  @ViewChild("chart") chart?: ChartComponent;
  public chartOptions?: Partial<ChartOptions>;
  @Input() data?: QuotesValues[];
  
  constructor(private cdr: ChangeDetectorRef){}
  getData(): ApexAxisChartSeries{
    return this.data ? [{data: this.data?.map(x=>x.value) as any[]}] : [{data:[]}]
  }  

  ngAfterViewInit(): void {
    this.chartOptions = {
      chart: {
        type: "area",
        height: 120,
        width: "100%",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },

      },
      grid: {
        show: false,
        xaxis: {
          lines: {
            show: false  
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "numeric",
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        opposite: true,
        labels: {
          show: false
        },
      },
      tooltip: {
        enabled: false,
      },
      fill: {
        colors: ['#34bdda']
      }
    };
    this.cdr.detectChanges();
  }
}
