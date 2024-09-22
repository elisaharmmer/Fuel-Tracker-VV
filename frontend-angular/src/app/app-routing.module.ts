import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GasStationListComponent } from './components/gas-station-list/gas-station-list.component';
import {GasStationDetailsComponent} from "./components/gas-station-details/gas-station-details.component";
import {PriceChartsComponent} from "./components/price-charts/price-charts.component";
import {ContactComponent} from "./components/contact/contact.component";

const routes: Routes = [
  { path: '', redirectTo: '/postos', pathMatch: 'full' },
  { path: 'postos', component: GasStationListComponent },
  { path: 'posto/:id', component: GasStationDetailsComponent },
  { path: 'graficos', component: PriceChartsComponent },
  { path: 'contato', component: ContactComponent },
  // { path: 'sobre', component: AboutComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
