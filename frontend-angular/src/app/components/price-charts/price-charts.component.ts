import { Component, OnInit } from '@angular/core';
import { GasStationService } from '../../services/gas-station.service';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { Moment } from 'moment';

@Component({
  selector: 'app-price-charts',
  templateUrl: './price-charts.component.html',
  styleUrls: ['./price-charts.component.scss']
})
export class PriceChartsComponent implements OnInit {
  dataInicio: string = '';
  dataFim: string = '';
  groupedDataByCombustivel: { [key: string]: any[] } = {};
  moment: Moment = moment();
  charts: Chart[] = [];

  constructor(private gasStationService: GasStationService) {}

  ngOnInit(): void {
    const today = moment();
    this.dataFim = today.format('YYYY-MM-DD');
    this.dataInicio = today.subtract(6, 'months').format('YYYY-MM-DD');
  }

  updateCharts() {
    if (this.dataInicio && this.dataFim) {
      this.gasStationService.getAveragePriceByPosto(this.dataInicio, this.dataFim).subscribe((data: any[]) => {
        // Filtrar os dados que não possuem preço médio nulo
        const filteredData = data.filter((item: any) => item.preco_medio !== null);
        this.groupedDataByCombustivel = this.groupDataByCombustivel(filteredData);

        // Destruir gráficos antigos antes de renderizar novos
        this.destroyCharts();

        // Renderizar gráficos apenas se houver dados
        if (filteredData.length > 0) {
          this.renderCharts();
        }
      });
    }
  }

  groupDataByCombustivel(data: any[]) {
    return data.reduce((acc, item) => {
      const combustivel = item.combustivel;
      if (!acc[combustivel]) {
        acc[combustivel] = [];
      }
      acc[combustivel].push(item);
      return acc;
    }, {});
  }

  objectKeys(obj: any) {
    return Object.keys(obj);
  }

  renderCharts() {
    this.objectKeys(this.groupedDataByCombustivel).forEach((combustivel, index) => {
      const canvas = document.getElementById(`chart-${index}`) as HTMLCanvasElement;

      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: this.groupedDataByCombustivel[combustivel].map(item => item.posto),
              datasets: [{
                label: `Preço Médio (${combustivel})`,
                data: this.groupedDataByCombustivel[combustivel].map(item => item.preco_medio),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
          this.charts.push(chart);
        }
      }
    });
  }

  destroyCharts() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  onDataInicioChange(newDate: string) {
    this.dataInicio = moment(newDate).format('YYYY-MM-DD');
    this.validateAndUpdateCharts();
  }

  onDataFimChange(newDate: string) {
    this.dataFim = moment(newDate).format('YYYY-MM-DD');
    this.validateAndUpdateCharts();
  }

  validateAndUpdateCharts() {
    if (this.dataInicio && this.dataFim) {
      this.updateCharts();
    }
  }
}
