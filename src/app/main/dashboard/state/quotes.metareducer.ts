import { ActionReducer, Action, MetaReducer } from '@ngrx/store';
import { QuotesState } from './quotes.model';

export function storageMetaReducer(
  reducer: ActionReducer<{ quotes: QuotesState }, Action<string>>
): ActionReducer<{ quotes: QuotesState }, Action<string>> {
  return function (state, action) {
    console.log(action.type)
    if (action.type === '@ngrx/store/init') {
        console.log('devia ter carregado')
      const storedState = localStorage.getItem('quotesState');
      const parsedState = storedState ? JSON.parse(storedState) : null;
      if (parsedState && parsedState.quotes) {
        return { quotes: parsedState.quotes };
      }
      return reducer(state, action);
    }
    const nextState = reducer(state, action);
    if (nextState && nextState.quotes) {
      localStorage.setItem('quotesState', JSON.stringify({ quotes: nextState.quotes }));
    }
    return nextState;
  };
}

export const metaReducers: MetaReducer<{ quotes: QuotesState }, Action<string>>[] = [
  storageMetaReducer,
];