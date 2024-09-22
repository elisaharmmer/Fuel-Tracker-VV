import { Component, OnInit, OnDestroy } from '@angular/core';
import { GasStationService } from '../../services/gas-station.service';
import * as moment from 'moment';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// Registrar os plugins
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
  insightsByCombustivel: { [key: string]: any } = {};

  charts: Chart<any, any, any>[] = [];

  // Propriedades para data binding
  dataInicio: string = '';
  dataFim: string = '';

  // Expor Object.keys para o template
  objectKeys = Object.keys;

  constructor(private gasStationService: GasStationService) {}

  ngOnInit(): void {
    const today = moment().format('YYYY-MM-DD');
    const sixMonthsAgo = moment().subtract(6, 'months').format('YYYY-MM-DD');

    // Inicializar as datas
    this.dataInicio = sixMonthsAgo;
    this.dataFim = today;

    // Atualizar os BehaviorSubjects com as datas iniciais
    this.dataInicioSubject.next(this.dataInicio);
    this.dataFimSubject.next(this.dataFim);

    // Subscrever às mudanças nas datas
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
          const filteredData = data.filter(
            (item: any) => item.preco_medio !== null
          );
          this.groupedDataByCombustivel =
            this.groupDataByCombustivel(filteredData);

          // Calcular os insights para cada combustível
          this.calculateInsights();

          this.destroyCharts();
          // Esperar o DOM atualizar antes de renderizar os gráficos
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

  calculateInsights() {
    this.insightsByCombustivel = {};

    Object.keys(this.groupedDataByCombustivel).forEach((combustivel) => {
      const data = this.groupedDataByCombustivel[combustivel];

      const prices = data.map((item) => parseFloat(item.preco_medio));

      const averagePrice =
        prices.reduce((sum, price) => sum + price, 0) / prices.length;

      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const priceDifference = maxPrice - minPrice;

      const minPricePosto = data.find(
        (item) => parseFloat(item.preco_medio) === minPrice
      )?.posto;
      const maxPricePosto = data.find(
        (item) => parseFloat(item.preco_medio) === maxPrice
      )?.posto;

      const numberOfPostos = data.length;

      // Cálculo do desvio padrão
      const variance =
        prices.reduce(
          (sum, price) => sum + Math.pow(price - averagePrice, 2),
          0
        ) / prices.length;
      const standardDeviation = Math.sqrt(variance);

      // Cálculo da diferença percentual
      const percentageDifference = ((maxPrice - minPrice) / minPrice) * 100;

      // Definir margem de tolerância
      const tolerance = 0.02; // 2 centavos

      // Cálculo da distribuição por faixa de preço com tolerância
      const equalAverage = data.filter(
        (item) =>
          Math.abs(parseFloat(item.preco_medio) - averagePrice) <= tolerance
      ).length;

      const belowAverage = data.filter(
        (item) =>
          parseFloat(item.preco_medio) < averagePrice - tolerance
      ).length;

      const aboveAverage = data.filter(
        (item) =>
          parseFloat(item.preco_medio) > averagePrice + tolerance
      ).length;

      // Percentuais
      const belowAveragePercent = (belowAverage / numberOfPostos) * 100;
      const equalAveragePercent = (equalAverage / numberOfPostos) * 100;
      const aboveAveragePercent = (aboveAverage / numberOfPostos) * 100;

      this.insightsByCombustivel[combustivel] = {
        averagePrice,
        minPrice,
        minPricePosto,
        maxPrice,
        maxPricePosto,
        priceDifference,
        percentageDifference,
        numberOfPostos,
        standardDeviation,
        priceDistribution: {
          belowAverage,
          equalAverage,
          aboveAverage,
          belowAveragePercent,
          equalAveragePercent,
          aboveAveragePercent,
          numberOfPostos,
        },
      };
    });
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
            const avgPrice = this.insightsByCombustivel[combustivel]
              .averagePrice;

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
                    backgroundColor: 'rgba(63, 80, 180, 1)',
                  },
                ],
              },
              options: {
                responsive: true,
                indexAxis: 'y',
                scales: {
                  y: {
                    beginAtZero: false,
                  },
                },
                plugins: {
                  datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: (value: any) => {
                      return typeof value === 'number'
                        ? value.toFixed(2)
                        : parseFloat(value).toFixed(2);
                    },
                  },
                },
              },
            });
            this.charts.push(chart);
          }
        }

        // Renderizar o gráfico de pizza
        const pieCanvas = document.getElementById(
          `pie-chart-${index}`
        ) as HTMLCanvasElement;

        if (pieCanvas) {
          const pieCtx = pieCanvas.getContext('2d');
          if (pieCtx) {
            const distribution =
              this.insightsByCombustivel[combustivel].priceDistribution;

            // Ajustar labels e dados com base na presença de postos "Na Média"
            let labels, dataValues, backgroundColors;

            if (distribution.equalAverage === 0) {
              // Remover a categoria "Na Média"
              labels = ['Abaixo da Média', 'Acima da Média'];
              dataValues = [distribution.belowAverage, distribution.aboveAverage];
              backgroundColors = [
                'rgba(75, 192, 192, 0.6)', // Abaixo da Média
                'rgba(255, 99, 132, 0.6)', // Acima da Média
              ];
            } else {
              labels = ['Abaixo da Média', 'Na Média', 'Acima da Média'];
              dataValues = [
                distribution.belowAverage,
                distribution.equalAverage,
                distribution.aboveAverage,
              ];
              backgroundColors = [
                'rgba(75, 192, 192, 0.6)', // Abaixo da Média
                'rgba(255, 205, 86, 0.6)', // Na Média
                'rgba(255, 99, 132, 0.6)', // Acima da Média
              ];
            }

            const pieChart = new Chart(pieCtx, {
              type: 'pie',
              data: {
                labels: labels,
                datasets: [
                  {
                    data: dataValues,
                    backgroundColor: backgroundColors,
                  },
                ],
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: '#fff',
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = distribution.numberOfPostos;
                        const percentage = ((value / total) * 100).toFixed(2);
                        return `${label}: ${value} postos (${percentage}%)`;
                      },
                    },
                  },
                },
              },
            });

            this.charts.push(pieChart);
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
