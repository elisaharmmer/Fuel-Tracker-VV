import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { GasStationListComponent } from './gas-station-list/gas-station-list.component';
import { GasStationDetailsComponent } from './gas-station-details/gas-station-details.component';
import { PriceChartsComponent } from './price-charts/price-charts.component';
import { AveragePricesComponent } from './average-prices/average-prices.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import {MatListModule} from "@angular/material/list";
import {MatDividerModule} from "@angular/material/divider";

@NgModule({
  declarations: [
    AppComponent,
    GasStationListComponent,
    GasStationDetailsComponent,
    PriceChartsComponent,
    AveragePricesComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
