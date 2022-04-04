import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { ChartsComponent } from '../charts/charts.component';
import { HomeComponent } from '../home/home.component';
import { WatchlistComponent } from '../watchlist/watchlist.component';
import { AuthOnlyGuard } from './auth-only.guard';

const routes: Routes = [
  { path: "", pathMatch: 'full', redirectTo: "home",
    // canActivate: [HomepageGuard]
  },
  { path: "home", component: HomeComponent,
    // canActivate: [AuthToWatchlistGuard]
  },
  { path: "login", component: LoginComponent, 
    // canActivate: [AuthToWatchlistGuard]
  },
  { path: "signup", component: SignupComponent, 
    // canActivate: [AuthToWatchlistGuard]
  },
  { path: "watchlist", component: WatchlistComponent, 
    canActivate: [AuthOnlyGuard]
  },
  { path: "charts", component: ChartsComponent, 
    canActivate: [AuthOnlyGuard]
  },
  { path: "charts/:symbolSelected", component: ChartsComponent, 
    canActivate: [AuthOnlyGuard]
  },
  { path: "**", redirectTo: "home", 
    // canActivate: [HomepageGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
