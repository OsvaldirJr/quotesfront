import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardChartComponent } from './chart.component';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { QuotesValues } from '@app/core/models';

describe('DashboardChartComponent', () => {
  let component: DashboardChartComponent;
  let fixture: ComponentFixture<DashboardChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardChartComponent],
      imports: [NgApexchartsModule],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set chartOptions after view init', () => {
    component.ngAfterViewInit();
    expect(component.chartOptions).toBeDefined();
    expect(component.chartOptions?.chart?.type).toBe('area');
  });

  it('should return correct data for chart', () => {
    const mockData: QuotesValues[] = [
      { time: 1, value: 10 },
      { time: 2, value: 12 },
      { time: 3, value: 11 },
    ];
    component.data = mockData;
    const chartData = component.getData();
    expect(chartData).toEqual([{ data: [10, 12, 11] }]);
  });

  it('should return empty array if data is undefined', () => {
    component.data = undefined;
    const chartData = component.getData();
    expect(chartData).toEqual([{ data: [] }]);
  });
});