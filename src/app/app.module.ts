import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './routes/app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from "./material/material.module";
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserMenuComponent } from './nav-bar/user-menu/user-menu.component';
import { AuthGuardInterceptor } from './interceptors/auth-guard.interceptor';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChartsComponent } from './charts/charts.component';
import { SymbolSelectorComponent } from './charts/symbol-selector/symbol-selector.component';
import { MainChartComponent } from './charts/main-chart/main-chart.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { QuotePanelComponent } from './charts/quote-panel/quote-panel.component';
import { HoverInfoPanelComponent } from './charts/hover-info-panel/hover-info-panel.component';
import { ChartsGuideComponent } from './charts/charts-guide/charts-guide.component';



@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    NavBarComponent,
    HomeComponent,
    WatchlistComponent,
    UserMenuComponent,
    ChartsComponent,
    SymbolSelectorComponent,
    MainChartComponent,
    QuotePanelComponent,
    HoverInfoPanelComponent,
    ChartsGuideComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    HttpClientModule,
    NgScrollbarModule,
    HighchartsChartModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthGuardInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
