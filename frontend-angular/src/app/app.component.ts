import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isDarkTheme = true; // Tema padrão é o dark

  gasStations = [
    { name: 'Posto 1', gasolinaAditivada: 'R$ 5,50', dieselS10: 'R$ 4,20', etanol: 'R$ 3,80', dieselS500: 'R$ 4,00', gasolinaComum: 'R$ 5,30' },
    { name: 'Posto 2', gasolinaAditivada: 'R$ 5,60', dieselS10: 'R$ 4,30', etanol: 'R$ 3,90', dieselS500: 'R$ 4,10', gasolinaComum: 'R$ 5,40' },
    // Adicione mais postos conforme necessário
  ];

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
}
