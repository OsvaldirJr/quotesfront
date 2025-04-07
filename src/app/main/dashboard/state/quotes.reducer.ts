// quotes.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { initialState, QuotesState } from './quotes.model';
import { setQuotesData, setQuotesList, setPageLength, setFilterButton } from './quotes.actions';

export const quotesReducer = createReducer(
  initialState,
  on(setQuotesData, (state, { quote }) => {
    const existingIndex = state.quotesArray.findIndex(x => x.key === quote.key);
    if (existingIndex === -1) {
      return { ...state, quotesArray: [...state.quotesArray, quote] };
    } else {
      const updatedQuotesArray = state.quotesArray.map((x, index) =>
        index === existingIndex ? quote : x
      );
      return { ...state, quotesArray: updatedQuotesArray };
    }
  }),
  on(setQuotesList, (state, { quotesList }) => ({ ...state, quotesList })),
  on(setPageLength, (state, { pageLength }) => ({ ...state, pageLength })),
  on(setFilterButton, (state, { filterButton }) => ({ ...state, selectedFilterButton: filterButton }))
);