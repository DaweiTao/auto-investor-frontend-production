import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartsService } from 'src/app/services/charts.service';
import { Quote, QuotesService } from 'src/app/services/quotes.service';

@Component({
  selector: 'app-quote-panel',
  templateUrl: './quote-panel.component.html',
  styleUrls: ['./quote-panel.component.css']
})
export class QuotePanelComponent implements OnInit, OnDestroy{
  private quotesSub: Subscription = new Subscription()
  private symbolSub: Subscription = new Subscription()
  public currentQuote: Quote | null = null

  constructor(private qs: QuotesService, private cs: ChartsService) { 
    
  }

  ngOnInit(): void {
    this.symbolSub = this.cs.selectedSymbol$.subscribe(symbol => {
      this.quotesSub.unsubscribe()
      if (symbol) {
        this.quotesSub = this.qs.quotes$.subscribe(quotes => {
          if (quotes) {
            for (let q of quotes) {
              if (q.symbol === symbol) {
                this.currentQuote = q
                return
              }
            }
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
      this.quotesSub.unsubscribe()
      this.symbolSub.unsubscribe()
  }
}
