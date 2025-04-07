// quotes.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuotesState } from './quotes.model';

export const selectQuotesState = createFeatureSelector<QuotesState>('quotes');

export const selectQuotesArray = createSelector(
  selectQuotesState,
  (state: QuotesState) => state.quotesArray
);

export const selectQuotesList = createSelector(
  selectQuotesState,
  (state: QuotesState) => state.quotesList
);

export const selectPageLength = createSelector(
  selectQuotesState,
  (state: QuotesState) => state.pageLength
);

export const selectFilterButton = createSelector(
  selectQuotesState,
  (state: QuotesState) => state.selectedFilterButton
);