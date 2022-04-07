import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import ITickerDoc, { ITicker } from '../models/tickerData';
import * as moment from 'moment-timezone';
import { environment } from 'src/environments/environment';


export interface CandlestickDataStore {
  contract: any,
  candlestickData: number[][],
  tickerData: ITicker[],
}


export interface Hoverdata extends ITicker{
  contract: any,
  change: number,
  percentChange: number,
  localDateShort: string,
  localDateLong: string,
}


const TICKER_DATA_URL = environment.apiUrl + '/ticker-data'


@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  public selectedSymbol$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)
  private candlestickDataUpdaterID: any
  public candlestickData$: BehaviorSubject<CandlestickDataStore | null> = new BehaviorSubject<CandlestickDataStore | null>(null)
  public hoverData$: BehaviorSubject<Hoverdata | null> = new BehaviorSubject<Hoverdata | null>(null)
  
  constructor(private http: HttpClient) { 

  }

  public startCandlesickDataStream(symbol: string | null) {
    // initial update, no delay
    this.updateCandlestickData(symbol)
    // update candlestick data every x mins
    this.candlestickDataUpdaterID = setInterval(() => {
      this.updateCandlestickData(symbol)
    }, 10 * 1000)
  }

  public stopCandlestickDataStream() {
    if (this.candlestickDataUpdaterID) {
      clearInterval(this.candlestickDataUpdaterID)
    }
    this.candlestickDataUpdaterID = null
    // this.candlestickData$.next(null)
  }

  private compareEpoch(tk1: ITicker, tk2: ITicker) {
    if (tk1.epoch < tk2.epoch){
      return -1;
    }
    if (tk1.epoch > tk2.epoch){
      return 1;
    }
    return 0;
  }

  private updateCandlestickData(symbol: string | null) {
    if (!symbol) {
      return
    }
    let params = new HttpParams().set('symbol', symbol);
    this.http.get<ITickerDoc>(TICKER_DATA_URL, {params})
    .pipe(take(1))
    .subscribe(tickerDataDoc => {
      if(!tickerDataDoc) {
        return
      }

      // sort by epoch
      let tickerDataSorted = tickerDataDoc.tickerData.sort(this.compareEpoch)
      let candlestickData: number[][] = []

      for (let row of tickerDataSorted) {
        let newRow = []
        // a workaround for highcharts's xaxis timezone bug
        let localEpoch = moment.unix(row.epoch).tz(tickerDataDoc.contract.timeZoneId).format('DD/MM/YYYY')
        newRow[0] = moment(localEpoch, 'DD/MM/YYYY').valueOf()
        newRow[1] = row.open
        newRow[2] = row.high
        newRow[3] = row.low
        newRow[4] = row.close
        candlestickData.push(newRow)
      }
      
      this.candlestickData$.next({
        candlestickData: candlestickData,
        contract: tickerDataDoc.contract,
        tickerData: tickerDataDoc.tickerData,
      })
      // console.log("Candlestick Updater: ", tickerDataDoc)
    })
  }
}
