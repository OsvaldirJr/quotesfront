import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { ChartOptions } from '@core/types';
import { ChartComponent } from "ng-apexcharts";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class DashboardChartComponent implements AfterViewInit {
  @ViewChild("chart") chart?: ChartComponent;
  public chartOptions?: Partial<ChartOptions>;
  @Input() data: any;

  ngAfterViewInit(): void {
    this.chartOptions = {
      series: [
        {
          name: "",
          data: [30, 15, 30, 10, 32, 6, 35]
        }
      ],
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
            show: false  //or just here to disable only x axis grids
          }
        },
        yaxis: {
          lines: {
            show: false  //or just here to disable only y axis
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
  }
}
