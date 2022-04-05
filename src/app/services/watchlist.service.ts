import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subscription, take } from 'rxjs';
import IWatchlist from '../models/watchlist';
import { UserAuthService } from './user-auth.service';
import { environment } from 'src/environments/environment';


const WATCHLIST_API_URL = environment.apiUrl + "/watchlist"


@Injectable({
  providedIn: 'root'
})
export class WatchlistService implements OnDestroy{

  public watchlist$: BehaviorSubject<string[] | null> = new BehaviorSubject<string[] | null>(null)
  private profileSub: Subscription = new Subscription()
  private currentUid: string | null = null

  constructor(private auth: UserAuthService, private http: HttpClient) { 
    this.profileSub = this.auth.currentUserProfile$.subscribe(profile => {
      if (profile && profile.uid) {
        this.currentUid = profile.uid
        this.getUserWatchlist(profile.uid)
      } else {
        this.currentUid = null
        this.watchlist$.next(null)
      }
    })
  }

  private getUserWatchlist(uid: string) {
    this.http.get<IWatchlist>(WATCHLIST_API_URL + `/${uid}`)
      .pipe(take(1))
      .subscribe(response => {
        if(response) {
          if(response.watchlist) {
            this.watchlist$.next(response.watchlist)
          } else {
            // create a new default watchlist for the user if he/she doesn't have one
            this.updateWatchlist(this.getDefaultWatchlist())
          }
        }
      })
  }

  public updateWatchlist(watchlist: string[]) {
    if (!this.currentUid) {
      console.log("Watchlist update failed, uid is null")
      return
    }
    const newWatchlistReqBody = {
      uid: this.currentUid,
      watchlist: watchlist,
    }
    this.http.post<IWatchlist>(WATCHLIST_API_URL + "/update", newWatchlistReqBody)
      .pipe(take(1))
      .subscribe(response => {
        if(response && response.watchlist) {
          this.watchlist$.next(response.watchlist)
        } else {
          this.watchlist$.next(null)
        }
      })
  }

  private getDefaultWatchlist(){
    const defaultWatchlist = [
      "AAPL", 
      "GOOGL", 
      "WMT", 
      "DIS",
      "EFA",
      "XLF",
      "TLT",
      "XLK",
      "SQQQ",
      "SMH"
    ]
    return defaultWatchlist
  }

  ngOnDestroy(): void {
    this.profileSub.unsubscribe()
  }
}
