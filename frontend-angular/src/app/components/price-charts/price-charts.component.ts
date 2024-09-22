import { Component, OnInit, OnDestroy } from '@angular/core';
import { GasStationService } from '../../services/gas-station.service';
import * as moment from 'moment';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import positioners from "chart.js/dist/plugins/plugin.tooltip";


// Register the plugins
Chart.register(...registerables);
Chart.register([ChartDataLabels, annotationPlugin]);

@Component({
  selector: 'app-price-charts',
  templateUrl: './price-charts.component.html',
  styleUrls: ['./price-charts.component.scss'],
})
export class PriceChartsComponent implements OnInit, OnDestroy {
  dataInicioSubject = new BehaviorSubject<string | null>(null);
  dataFimSubject = new BehaviorSubject<string | null>(null);
  subscription: Subscription = new Subscription();
  groupedDataByCombustivel: { [key: string]: any[] } = {};
  charts: Chart[] = [];

  // Added properties for data binding
  dataInicio: string = '';
  dataFim: string = '';

  // Expose Object.keys to the template
  objectKeys = Object.keys;

  constructor(private gasStationService: GasStationService) {}

  ngOnInit(): void {
    const today = moment().format('YYYY-MM-DD');
    const sixMonthsAgo = moment().subtract(6, 'months').format('YYYY-MM-DD');

    // Initialize the date properties
    this.dataInicio = sixMonthsAgo;
    this.dataFim = today;

    // Update the BehaviorSubjects with the initial dates
    this.dataInicioSubject.next(this.dataInicio);
    this.dataFimSubject.next(this.dataFim);

    // Subscribe to changes in dates
    this.subscription.add(
      combineLatest([this.dataInicioSubject, this.dataFimSubject])
        .pipe(filter(([dataInicio, dataFim]) => !!dataInicio && !!dataFim))
        .subscribe(() => {
          this.updateCharts();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateCharts() {
    if (this.dataInicio && this.dataFim) {
      this.gasStationService
        .getAveragePriceByPosto(this.dataInicio, this.dataFim)
        .subscribe((data: any[]) => {

          const filteredData = data.filter((item: any) => item.preco_medio !== null);
          this.groupedDataByCombustivel = this.groupDataByCombustivel(filteredData);
          this.destroyCharts();
          // Wait for the DOM to update before rendering charts
          setTimeout(() => {
            this.renderCharts();
          }, 0);
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

  getAverageByCombustivel(combustivel: any) {
    return this.groupedDataByCombustivel[combustivel].reduce((sum, item) => parseFloat(sum) + parseFloat(item.preco_medio), 0) / this.groupedDataByCombustivel[combustivel].length;
  }

  renderCharts() {
    Object.keys(this.groupedDataByCombustivel).forEach(
      (combustivel, index) => {
        const canvas = document.getElementById(
          `chart-${index}`
        ) as HTMLCanvasElement;

        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {

            const avgPrice = this.getAverageByCombustivel(combustivel);
            const chart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: this.groupedDataByCombustivel[combustivel].map(
                  (item) => item.posto
                ),
                datasets: [
                  {
                    label: `Preço Médio (${combustivel}) (R$)`,
                    data: this.groupedDataByCombustivel[combustivel].map(
                      (item) => item.preco_medio
                    ),
                    backgroundColor: 'rgb(63, 80, 180, 1)',
                  },
                ],
              },
              options: {
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: false
                  },
                },
                plugins: {
                  datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: (value: any) => {
                      return typeof value === 'number' ? value.toFixed(2) : parseFloat(value).toFixed(2);
                    },
                  },
                  annotation: {
                    annotations: {
                      average: {
                        type: 'line',
                        borderColor: 'red',
                        borderWidth: 3,
                        borderDash: [6, 6],
                        borderDashOffset: 0,
                        label: {
                          display: true,
                          content: `Média: R$ ${avgPrice.toFixed(2)}`,
                          position: 'end',
                          backgroundColor: 'red',
                        },
                        scaleID: 'y',
                        value: avgPrice
                      },
                    },
                  },
                },
              },
            });
            this.charts.push(chart);
          }
        }
      }
    );
  }

  destroyCharts() {
    this.charts.forEach((chart) => chart.destroy());
    this.charts = [];
  }

  onDataInicioChange(newDate: any) {
    const dateFormatted = moment(newDate).format('YYYY-MM-DD');
    this.dataInicioSubject.next(dateFormatted);
  }

  onDataFimChange(newDate: any) {
    const dateFormatted = moment(newDate).format('YYYY-MM-DD');
    this.dataFimSubject.next(dateFormatted);
  }
}
