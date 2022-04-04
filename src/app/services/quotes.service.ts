import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import * as moment from 'moment-timezone';
import { BehaviorSubject, ReplaySubject, Subscription, take } from 'rxjs';
import IQuotes from '../models/quotes';
import { WatchlistService } from './watchlist.service';

export interface Quote {
  contract: any,
  symbol: string,
  date: any,
  timeZoneId: string,
  longName: string,
  primaryExchange: string,
  localSymbol: string,
  currency: string,
  stockType: string,
  open: number,
  high: number,
  low: number,
  price: number,
  prevClose: number,
  volume: number,
  average: number,
  change: number,
  percentChange: number,
}

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  // private watchlistSub: Subscription = new Subscription()
  private currentWatchlist: string[] | null = null
  public quotes$: BehaviorSubject<Quote[] | null> = new BehaviorSubject<Quote[] | null>(null)
  private quoteUpdaterID: any 

  constructor(private http: HttpClient) { 
    
  }

  public startQuotesStream(watchlist: string[]) {
    this.currentWatchlist = watchlist
    // initial update, no delay
    this.updateQuotes()
    // update quotes every x mins
    this.quoteUpdaterID = setInterval(() => {
      this.updateQuotes()
    }, 10 * 1000)
  }

  public stopQuotesStream() {
    if (this.quoteUpdaterID) {
      clearInterval(this.quoteUpdaterID)
    }
    this.quoteUpdaterID = null
    this.currentWatchlist = null
    // this.quotes$.next(null)
  }  

  public updateQuotes() {
    if (!this.currentWatchlist) {
      return 
    }
    let params = new HttpParams().set('symbols', JSON.stringify(this.currentWatchlist));
    this.http.get<IQuotes[]>(`http://localhost:3000/api/quotes`, {params})
    .pipe(take(1))
    .subscribe(quoteDocs => {
      if(quoteDocs) {
        let newQuotes = []

        for (let doc of quoteDocs) {
          if (!doc) {
            continue
          }

          let q: Quote = {
            contract: doc.contract,
            symbol: doc.contract.symbol,
            timeZoneId: doc.contract.timeZoneId,
            primaryExchange: doc.contract.primaryExchange,
            localSymbol: doc.contract.localSymbol,
            stockType: doc.contract.stockType,
            longName: doc.contract.longName,
            currency: doc.contract.currency,
            date: doc.latestQuote.epoch,
            open: doc.latestQuote.open,
            high: doc.latestQuote.high,
            low: doc.latestQuote.low,
            price: doc.latestQuote.close,
            prevClose: doc.latestQuote.prevClose,
            volume: doc.latestQuote.volume,
            average: doc.latestQuote.average,
            change: 0,
            percentChange: 0,
          }
          q.change = q.price - q.prevClose
          q.percentChange = 100 * q.change / q.prevClose
          q.date = moment.unix(q.date).tz(q.timeZoneId).format('DD/MM/YYYY UTC Z')
          newQuotes.push(q)
        }
        this.quotes$.next(newQuotes)
        console.log("Qutoes Updater: ", newQuotes)
      }
    })
  }

}
