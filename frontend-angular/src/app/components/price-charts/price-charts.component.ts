import { Component, OnInit } from '@angular/core';
import { GasStationService } from '../../services/gas-station.service';
import * as moment from 'moment';
import {Chart} from "chart.js/auto";

@Component({
  selector: 'app-price-charts',
  templateUrl: './price-charts.component.html',
  styleUrls: ['./price-charts.component.scss']
})
export class PriceChartsComponent implements OnInit {
  averagePriceData: any[] = [];
  priceVariationData: any[] = [];
  dataInicio: moment.Moment;
  dataFim: moment.Moment;

  constructor(private gasStationService: GasStationService) {
    // Definindo a data de fim como hoje e a data de início como 6 meses atrás
    this.dataFim = moment();
    this.dataInicio = moment().subtract(6, 'months');
  }

  ngOnInit(): void {
    this.getAveragePriceByPosto();
    this.getPriceVariationByPosto();
  }

  getAveragePriceByPosto(): void {
    const formattedDataInicio = this.dataInicio.format('YYYY-MM-DD');
    const formattedDataFim = this.dataFim.format('YYYY-MM-DD');

    this.gasStationService.getAveragePriceByPosto(formattedDataInicio, formattedDataFim)
      .subscribe(data => {
        this.averagePriceData = data;
        this.createAveragePriceChart();
      });
  }

  getPriceVariationByPosto(): void {
    this.gasStationService.getPriceVariationByPosto()
      .subscribe(data => {
        this.priceVariationData = data;
        this.createPriceVariationChart();
      });
  }

  createAveragePriceChart(): void {
    const labels = this.averagePriceData.map(item => `${item.posto} - ${item.combustivel}`);
    const data = this.averagePriceData.map(item => item.preco_medio);

    new Chart('averagePriceChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Preço Médio (R$)',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Preço Médio (R$)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Postos e Combustíveis'
            }
          }
        }
      }
    });
  }

  createPriceVariationChart(): void {
    const labels = this.priceVariationData.map(item => item.posto);
    const data = this.priceVariationData.map(item => item.variacao);

    new Chart('priceVariationChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Variação de Preço (R$)',
          data: data,
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Variação de Preço (R$)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Postos'
            }
          }
        }
      }
    });
  }

  // Atualizar gráficos ao alterar as datas
  updateCharts(): void {
    this.getAveragePriceByPosto();
  }
}
