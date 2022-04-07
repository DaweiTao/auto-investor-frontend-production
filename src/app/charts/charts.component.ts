import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChartsService } from '../services/charts.service';
import { QuotesService } from '../services/quotes.service';
import { WatchlistService } from '../services/watchlist.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit, OnDestroy{
  private activeRouteSub: Subscription = new Subscription()
  private watchlistSub: Subscription = new Subscription()

  constructor(
    private ar: ActivatedRoute, 
    public cs: ChartsService, 
    private qs: QuotesService,
    private wls: WatchlistService,
    ) {
    // have to use first child here, the "current" activedRoute is depends on where
    // the service is provided. Therefore in this case, the actived route is root.
    
  }

  ngOnInit(): void {
    this.watchlistSub = this.wls.watchlist$.subscribe(watchlist => {
      // clear timer if the watchlist is updated
      this.qs.stopQuotesStream()
      if (watchlist) {
        this.qs.startQuotesStream(watchlist)
      }
    })

    this.activeRouteSub = this.ar.paramMap.subscribe((param: ParamMap) => {
      // clear timer if selected symbol changed
      this.cs.stopCandlestickDataStream()
      this.cs.selectedSymbol$.next(null)
      
      if(param.has("symbolSelected")) {
        let selectedSymbol = param.get("symbolSelected")
        this.cs.selectedSymbol$.next(selectedSymbol)
        this.cs.startCandlesickDataStream(selectedSymbol)
      }
    })
  }

  ngOnDestroy(): void {
    this.qs.stopQuotesStream()
    this.watchlistSub.unsubscribe()
    this.cs.stopCandlestickDataStream()
    this.activeRouteSub.unsubscribe()
  }
}
