import {Component, OnInit} from '@angular/core';
import {GasStationService} from "../../services/gas-station.service";

@Component({
  selector: 'app-price-charts',
  templateUrl: './price-charts.component.html',
  styleUrls: ['./price-charts.component.scss']
})
export class PriceChartsComponent implements OnInit {
  precoMedioPostos: any[] = [];
  variacaoPrecoPostos: any[] = [];
  dataInicio = '2024-01-01';
  dataFim = '2024-12-31';

  constructor(private gasStationService: GasStationService) {}

  ngOnInit(): void {
    this.loadAveragePriceByPosto();
    this.loadPriceVariationByPosto();
  }

  loadAveragePriceByPosto() {
    this.gasStationService.getAveragePriceByPosto(this.dataInicio, this.dataFim).subscribe(data => {
      this.precoMedioPostos = data;
    });
  }

  loadPriceVariationByPosto() {
    this.gasStationService.getPriceVariationByPosto().subscribe(data => {
      this.variacaoPrecoPostos = data;
    });
  }
}
