export class BrapiQuotes{
    public stocks?: Stock[];
}

export class Stock{
    stock?: string
    name?: string
    shortName?: string
    close?: number
    change?: number
    volume?: number
    market_cap?: number
    logo?: string
    sector?: string
    type?: string
  } 