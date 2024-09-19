import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatLineModule, MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { GasStationListComponent } from "./components/gas-station-list/gas-station-list.component";
import { GasStationDetailsComponent } from "./components/gas-station-details/gas-station-details.component";
import { PriceChartsComponent } from "./components/price-charts/price-charts.component";
import { AveragePricesComponent } from "./components/average-prices/average-prices.component";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { ReplaceCommaPipe } from './pipes/replace-comma.pipe';
import { MatChipsModule } from "@angular/material/chips";
import { AppRoutingModule } from './app-routing.module';
import {MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs"; // Importa o AppRoutingModule

@NgModule({
  declarations: [
    AppComponent,
    GasStationListComponent,
    GasStationDetailsComponent,
    PriceChartsComponent,
    AveragePricesComponent,
    SidenavComponent,
    ReplaceCommaPipe
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
    MatDividerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    HttpClientModule,
    MatChipsModule,
    MatLineModule,
    AppRoutingModule,
    MatTableModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
