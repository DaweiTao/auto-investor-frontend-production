import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Quote, QuotesService } from '../services/quotes.service';
import { WatchlistService } from '../services/watchlist.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit, OnDestroy, AfterViewInit{
  private watchlistSub: Subscription = new Subscription()
  private quotesSub: Subscription = new Subscription()
  public dataSource: MatTableDataSource<Quote> = new MatTableDataSource();
  public displayedColumns: string[] = [
    'symbol', "price", 'percentChange', 'change', 
    "previousClose", "volume", 'high', "low", 'open', 
    "currency", "date", "timezone",
  ];
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  // @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator();

  constructor(private wls: WatchlistService, private qs: QuotesService) {
    
  }

  ngOnInit(): void {
    this.watchlistSub = this.wls.watchlist$.subscribe(watchlist => {
      // clear timer if the watchlist is updated
      this.qs.stopQuotesStream()

      if (watchlist) {
        this.qs.startQuotesStream(watchlist)
      }
    })

    this.quotesSub = this.qs.quotes$.subscribe(quotes => {
      if (quotes) {
        this.dataSource = new MatTableDataSource(quotes)
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      }
    })
  }

  ngAfterViewInit(): void {
    if(this.dataSource) {
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    }
  }

  onUpdate(): void {
    this.qs.updateQuotes()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.qs.stopQuotesStream()
    this.watchlistSub.unsubscribe()
    this.quotesSub.unsubscribe()
  }
}
