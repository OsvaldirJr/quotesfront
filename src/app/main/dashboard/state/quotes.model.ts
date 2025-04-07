export interface QuotesValues {
    time: any;
    value: number;
  }
  
  export class Quotes {
    key?: string;
    name?: string;
    logo?: string;
    time: any;
    value?: QuotesValues[];
    isRising?: boolean;
  
    constructor(init?: Partial<Quotes>) {
      Object.assign(this, init);
      if (!this.value) {
        this.value = [];
      }
    }
  }
  
  export interface QuotesState {
    quotesArray: Quotes[];
    quotesList: Quotes[];
    pageLength: number;
    selectedFilterButton?: 'rising' | 'falling';
  }
  
  export const initialState: QuotesState = {
    quotesArray: [],
    quotesList: [],
    pageLength: 8,
    selectedFilterButton: undefined,
  };