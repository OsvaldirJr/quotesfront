import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { of, Subject } from 'rxjs';
import { Quotes, Stock } from '@core/models';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BrapiHttpService, QuotesHubService } from '@app/core/services';
import { NavbarComponent } from '@app/main/dashboard/components/navbar/navbar.component';
import { HeaderComponent } from '@app/main/dashboard/components/header/header.component';
import { CardComponent } from '@app/main/dashboard/components/card/card.component';
import { DashboardChartComponent } from '@app/main/dashboard/components/chart/chart.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let quotesHubServiceSpy: jasmine.SpyObj<QuotesHubService>;
  let brapiHttpServiceSpy: jasmine.SpyObj<BrapiHttpService>;
  let destroySubject = new Subject();

  beforeEach(async () => {
    quotesHubServiceSpy = jasmine.createSpyObj('QuotesHubService', ['receiveMessages']);
    brapiHttpServiceSpy = jasmine.createSpyObj('BrapiHttpService', ['getQuotes']);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent, 
                     NavbarComponent,
                     HeaderComponent,
                     DashboardChartComponent,
                     CardComponent
    ],
    imports:[NgApexchartsModule],
      providers: [
        { provide: QuotesHubService, useValue: quotesHubServiceSpy },
        { provide: BrapiHttpService, useValue: brapiHttpServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    component['_destroy$'] = destroySubject;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call _setTickersData and _webSocketMessageListener on ngOnInit', () => {
    brapiHttpServiceSpy.getQuotes.and.returnValue(of({ stocks: [] }));
    quotesHubServiceSpy.receiveMessages.and.returnValue(of({}));

    component.ngOnInit();

    expect(brapiHttpServiceSpy.getQuotes).toHaveBeenCalled();
    expect(quotesHubServiceSpy.receiveMessages).toHaveBeenCalled();
  });

  it('should unsubscribe from subscriptions on ngOnDestroy', () => {
    const destroySpy = spyOn(destroySubject, 'next');
    const completeSpy = spyOn(destroySubject, 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should set quotesArray and quotesList when _setQuotesData is called', () => {
    const mockTickers: Stock[] = [{ stock: 'TEST', name: 'Test Stock', logo: 'test.png', change: 1, close: 1 }];
    component['_tickers'] = mockTickers;
    component['_setQuotesData']({ TEST: 10, timestamp: '12:00' });
    expect(component.quotesArray.length).toBe(1);
    expect(component.quotesList.length).toBe(1);
  });

  it('should update existing quote when _setQuotesData is called with existing key', () => {
    const mockTickers: Stock[] = [{ stock: 'TEST', name: 'Test Stock', logo: 'test.png', change: 1, close: 1 }];
    component['_tickers'] = mockTickers;
    component.quotesArray = [new Quotes({ key: 'TEST', name: 'Test Stock', logo: 'test.png', time: 11, value: 9, isRising: true})];
    component['_setQuotesData']({ TEST: 10, timestamp: '12:00' });
    expect(component.quotesArray[0].value.length).toBe(2);
  });

  it('should paginate quotesList', () => {
    component.quotesArray = Array.from({ length: 16 }, (_, i) => new Quotes({ key: `TEST${i}`, name: `Test Stock ${i}`, logo: `test${i}.png`, time: 12, value: 10, isRising: true}));
    component.paginate();
    expect(component.quotesList.length).toBe(16);
  });

  it('should filter rising quotes when selectedFilterButton is rising', () => {
    component.quotesArray = [
        new Quotes({ key: 'TEST1', name: 'Test Stock 1', logo: 'test1.png', time: 12, value: 10, isRising: true}),
        new Quotes({ key: 'TEST2', name: 'Test Stock 2', logo: 'test2.png', time: 12, value: 9 , isRising: false}),
      ];
    component.selectedFilterButton = 'rising';
    component['_extractAndPaginateList']();
    expect(component.quotesList.length).toBe(1);
    expect(component.quotesList[0].key).toBe('TEST1');
  });

  it('should filter falling quotes when selectedFilterButton is falling', () => {
    component.quotesArray = [
        new Quotes({ key: 'TEST1', name: 'Test Stock 1', logo: 'test1.png', time: 12, value: 10, isRising: true}),
        new Quotes({ key: 'TEST2', name: 'Test Stock 2', logo: 'test2.png', time: 12, value: 9 , isRising: false}),
      ];
    component.selectedFilterButton = 'falling';
    component['_extractAndPaginateList']();
    expect(component.quotesList.length).toBe(1);
    expect(component.quotesList[0].key).toBe('TEST2');
  });

  it('should filter falling quotes when selectedFilterButton is undefined', () => {
    component.quotesArray = [
        new Quotes({ key: 'TEST1', name: 'Test Stock 1', logo: 'test1.png', time: 12, value: 10, isRising: true}),
        new Quotes({ key: 'TEST2', name: 'Test Stock 2', logo: 'test2.png', time: 12, value: 9 , isRising: false}),
      ];
    component.selectedFilterButton = undefined;
    component['_extractAndPaginateList']();
    expect(component.quotesList.length).toBe(2);
  });

  it('should clear filter when click twice on button', () => {
    component.quotesArray = [
      new Quotes({ key: 'TEST1', name: 'Test Stock 1', logo: 'test1.png', time: 12, value: 10, isRising: true}),
      new Quotes({ key: 'TEST2', name: 'Test Stock 2', logo: 'test2.png', time: 12, value: 9 , isRising: false}),
    ];
    component.changeFilter('rising');
    expect(component.selectedFilterButton).toBe('rising');
    expect(component.quotesList.length).toBe(1);
    component.changeFilter('rising');
    expect(component.quotesList.length).toBe(2);
    expect(component.selectedFilterButton).toBeUndefined();
  });
});