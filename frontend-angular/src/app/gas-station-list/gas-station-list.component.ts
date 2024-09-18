import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gas-station-list',
  templateUrl: './gas-station-list.component.html',
  styleUrls: ['./gas-station-list.component.scss']
})
export class GasStationListComponent implements OnInit {
  gasStations = [
    { name: 'Posto 1', gasolinaAditivada: 'R$ 5,50', dieselS10: 'R$ 4,20', etanol: 'R$ 3,80', dieselS500: 'R$ 4,00', gasolinaComum: 'R$ 5,30' },
    { name: 'Posto 2', gasolinaAditivada: 'R$ 5,60', dieselS10: 'R$ 4,30', etanol: 'R$ 3,90', dieselS500: 'R$ 4,10', gasolinaComum: 'R$ 5,40' },
    // Adicione mais postos conforme necessário
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
