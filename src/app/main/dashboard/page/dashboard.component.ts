import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, take, takeUntil } from 'rxjs';
import { BrapiQuotes, Stock } from '@core/models';
import { BrapiHttpService, QuotesHubService } from '@core/services';
import { setQuotesData, setQuotesList, setPageLength, setFilterButton } from '../state/quotes.actions';
import { selectQuotesArray, selectPageLength, selectFilterButton, selectQuotesList } from '../state/quotes.selectors';
import { Quotes, QuotesState } from '../state/quotes.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: false,
})
export class DashboardComponent implements OnInit, OnDestroy {
  public quotesArray$ = this.store.select(selectQuotesArray);
  public quotesList$ = this.store.select(selectQuotesList);
  public pageLength$ = this.store.select(selectPageLength);
  public selectedFilterButton$ = this.store.select(selectFilterButton);

  private _tickers?: Stock[];
  private _destroy$: Subject<any> = new Subject<any>();

  constructor(
    public webSocketService: QuotesHubService,
    public brapiHttpService: BrapiHttpService,
    private store: Store<{ quotes: QuotesState }>
  ) { }

  ngOnInit(): void {
    this._setTickersData();
    this._webSocketMessageListener();
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  private _webSocketMessageListener() {
    this.webSocketService
      .receiveMessages()
      .pipe(takeUntil(this._destroy$))
      .subscribe((message: any) => this._setQuotesData(message));
  }

  private _setQuotesData(data: any) {
    const name = Object.keys(data)[0];
    const tickers = this._tickers?.find((x) => x.stock == name);
    if (tickers) {
      const time = data.timestamp;
      const value = Object.values(data)[0] as number;
      const quote = new Quotes({
        key: name,
        name: tickers?.name!,
        logo: tickers?.logo!,
        time,
        value: [{ time, value }],
        isRising: tickers?.change! > 0,
      });

      this.store.select(selectQuotesArray).pipe(take(1)).subscribe(quotesArray => {
        const existingQuote = quotesArray.find(x => x.key === name);

        if (!existingQuote || JSON.stringify(existingQuote) !== JSON.stringify(quote)) {
          this.store.dispatch(setQuotesData({ quote }));
          this._extractAndPaginateList();
        }
      });
    }
  }

  private _extractAndPaginateList() {
    this.pageLength$.pipe(takeUntil(this._destroy$)).subscribe(pageLength => {
      this.selectedFilterButton$.pipe(takeUntil(this._destroy$)).subscribe(selectedFilter => {
        this.quotesArray$.pipe(takeUntil(this._destroy$)).subscribe(quotesArray => {
          let filteredQuotes = quotesArray;
          if (selectedFilter === 'rising') {
            filteredQuotes = quotesArray.filter((x) => x.isRising);
          } else if (selectedFilter === 'falling') {
            filteredQuotes = quotesArray.filter((x) => !x.isRising);
          }
          this.store.dispatch(setQuotesList({ quotesList: filteredQuotes.slice(0, pageLength) }));
        });
      });
    });
  }

  private _setTickersData() {
    this.brapiHttpService.getQuotes().subscribe({
      next: (tickers: BrapiQuotes) => {
        this._tickers = tickers.stocks;
      },
    });
  }

  public paginate() {
    this.pageLength$.pipe(takeUntil(this._destroy$)).subscribe(pageLength => {
      this.store.dispatch(setPageLength({ pageLength: pageLength + 8 }));
    });
  }

  public changeFilter(selectedButton: 'rising' | 'falling') {
    this.selectedFilterButton$.pipe(takeUntil(this._destroy$)).subscribe(currentFilter => {
      const newFilter = currentFilter === selectedButton ? undefined : selectedButton;
      this.store.dispatch(setFilterButton({ filterButton: newFilter }));
      this._extractAndPaginateList();
    });
  }
}