import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Quote, QuotesService } from 'src/app/services/quotes.service';
import { WatchlistService } from 'src/app/services/watchlist.service';

@Component({
  selector: 'app-symbol-selector',
  templateUrl: './symbol-selector.component.html',
  styleUrls: ['./symbol-selector.component.css']
})
export class SymbolSelectorComponent implements OnInit, OnDestroy{
  private quotesSub: Subscription = new Subscription()
  public currentQuotes: Quote[] = []

  constructor(private qs: QuotesService) { 
    
  }

  ngOnInit(): void {
    this.quotesSub = this.qs.quotes$.subscribe(quotes => {
      if (quotes) {
        this.currentQuotes = quotes
      } 
    })
  }

  onUpdate(): void {
    this.qs.updateQuotes()
  }

  ngOnDestroy(): void {
    this.quotesSub.unsubscribe()
  }
}
