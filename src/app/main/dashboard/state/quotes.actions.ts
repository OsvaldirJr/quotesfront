import { Quotes } from './quotes.model';
import { createAction, props } from '@ngrx/store';

export const setQuotesData = createAction(
  '[Quotes] Set Quotes Data',
  props<{ quote: Quotes }>()
);

export const setQuotesList = createAction(
  '[Quotes] Set Quotes List',
  props<{ quotesList: Quotes[] }>()
);

export const setPageLength = createAction(
  '[Quotes] Set Page Length',
  props<{ pageLength: number }>()
);

export const setFilterButton = createAction(
  '[Quotes] Set Filter Button',
  props<{ filterButton?: 'rising' | 'falling' }>()
);

export const loadQuotesState = createAction('[Quotes] Load Quotes State');