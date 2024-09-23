import { Component, OnInit, OnDestroy } from '@angular/core';
import { GasStationService } from '../../services/gas-station.service';
import * as moment from 'moment';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { DownloadEventService } from '../../services/download-event.service';
import {MatDialog} from "@angular/material/dialog";
import {ModalAlertComponent} from "../modal-alert/modal-alert.component";

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
  combustivelSubject = new BehaviorSubject<string | null>(null);
  subscription: Subscription = new Subscription();
  groupedDataByCombustivel: { [key: string]: any[] } = {};
  insightsByCombustivel: { [key: string]: any } = {};

  charts: Chart<any, any, any>[] = [];

  // Propriedades para data binding
  dataInicio: string = '';
  dataFim: string = '';
  combustivelSelecionado: string = '';

  // Expor Object.keys para o template
  objectKeys = Object.keys;

  // Lista de combustíveis disponíveis
  combustiveis: string[] = [];

  // Subscription para o serviço de download
  private downloadSubscription: Subscription = new Subscription();

  constructor(
    private gasStationService: GasStationService,
    private downloadEventService: DownloadEventService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const today = moment().format('YYYY-MM-DD');
    const sixMonthsAgo = moment().subtract(6, 'months').format('YYYY-MM-DD');

    // Subscribe para os eventos de exportação
    this.downloadSubscription = this.downloadEventService.downloadEvent$.subscribe(type => {
      if (type === 'pdf') {
        this.exportToPDF();
      } else if (type === 'csv') {
        this.exportToCSV();
      } else if (type === 'excel') {
        this.exportToExcel();
      }
    });

    // Inicializar as datas
    this.dataInicio = sixMonthsAgo;
    this.dataFim = today;

    // Atualizar os BehaviorSubjects com as datas iniciais
    this.dataInicioSubject.next(this.dataInicio);
    this.dataFimSubject.next(this.dataFim);

    // Atualizar os gráficos inicialmente
    this.updateCharts(this.dataInicio, this.dataFim);

    // Subscrever às mudanças nos filtros
    this.subscription.add(
      combineLatest([
        this.dataInicioSubject,
        this.dataFimSubject,
        this.combustivelSubject,
      ])
        .pipe(filter(([dataInicio, dataFim]) => !!dataInicio && !!dataFim))
        .subscribe((data) => {
          this.updateCharts(String(data[0]), String(data[1]));
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.downloadSubscription) {
      this.downloadSubscription.unsubscribe();
    }
  }

  updateCharts(dataInicio: string, dataFim: string) {
    if (dataInicio && dataFim) {
      this.gasStationService
        .getAveragePriceByPosto(dataInicio, dataFim)
        .subscribe((data: any[]) => {
          const filteredData = data.filter(
            (item: any) => item.preco_medio !== null
          );

          // Extrair a lista de combustíveis disponíveis
          this.combustiveis = [
            ...new Set(filteredData.map((item) => item.combustivel)),
          ];

          // Aplicar o filtro de combustível
          const dataToUse = filteredData.filter(
            (item: any) =>
              !this.combustivelSelecionado ||
              item.combustivel === this.combustivelSelecionado
          );

          this.groupedDataByCombustivel = this.groupDataByCombustivel(dataToUse);

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

      const variance =
        prices.reduce(
          (sum, price) => sum + Math.pow(price - averagePrice, 2),
          0
        ) / prices.length;
      const standardDeviation = Math.sqrt(variance);

      const percentageDifference = ((maxPrice - minPrice) / minPrice) * 100;

      const tolerance = 0.02;

      const equalAverage = data.filter(
        (item) =>
          Math.abs(parseFloat(item.preco_medio) - averagePrice) <= tolerance
      ).length;

      const belowAverage = data.filter(
        (item) => parseFloat(item.preco_medio) < averagePrice - tolerance
      ).length;

      const aboveAverage = data.filter(
        (item) => parseFloat(item.preco_medio) > averagePrice + tolerance
      ).length;

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

        const pieCanvas = document.getElementById(
          `pie-chart-${index}`
        ) as HTMLCanvasElement;

        if (pieCanvas) {
          const pieCtx = pieCanvas.getContext('2d');
          if (pieCtx) {
            const distribution =
              this.insightsByCombustivel[combustivel].priceDistribution;

            let labels, dataValues, backgroundColors;

            if (distribution.equalAverage === 0) {
              labels = ['Abaixo da Média', 'Acima da Média'];
              dataValues = [
                distribution.belowAverage,
                distribution.aboveAverage,
              ];
              backgroundColors = [
                'rgba(127,187,250,0.6)',
                'rgba(255, 99, 132, 0.6)',
              ];
            } else {
              labels = ['Abaixo da Média', 'Na Média', 'Acima da Média'];
              dataValues = [
                distribution.belowAverage,
                distribution.equalAverage,
                distribution.aboveAverage,
              ];
              backgroundColors = [
                'rgba(118,153,239,0.6)',
                'rgba(195,195,195,0.6)',
                'rgba(237,99,155,0.6)',
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

  onCombustivelChange(newValue: any) {
    this.combustivelSubject.next(newValue);
  }

  async exportToPDF(): Promise<void> {
    const doc = new jsPDF({
      orientation: 'landscape' // Mantém a orientação horizontal
    });

    const title = `Relatório de Preços - ${moment(this.dataInicio).format('DD/MM/YYYY')} a ${moment(this.dataFim).format('DD/MM/YYYY')}`;

    // Iterar sobre cada combustível
    for (let i = 0; i < this.charts.length; i++) {
      const combustivel = Object.keys(this.groupedDataByCombustivel)[i];
      const canvasElement = document.getElementById(`chart-${i}`) as HTMLCanvasElement;
      const pieCanvasElement = document.getElementById(`pie-chart-${i}`) as HTMLCanvasElement;
      const insights = this.insightsByCombustivel[combustivel];

      if (canvasElement) {
        try {
          // Página com o gráfico de barras
          const canvas = await html2canvas(canvasElement);
          const imgData = canvas.toDataURL('image/png');

          // Adicionar título e gráfico de barras
          doc.text(`${title}`, 10, 10);
          doc.text(`Combustível: ${combustivel}`, 10, 20);
          doc.addImage(imgData, 'PNG', 10, 30, 270, 150);

          // Adicionar nova página para os insights após o gráfico de barras
          doc.addPage();

          if (pieCanvasElement && insights) {
            // Página com insights (gráfico de pizza e dados)
            const pieCanvas = await html2canvas(pieCanvasElement);
            const pieImgData = pieCanvas.toDataURL('image/png');

            // Adicionar título e gráfico de pizza
            doc.text(`${title}`, 10, 10);
            doc.text(`Combustível: ${combustivel} (Insights)`, 10, 20);

            // Definir tamanho proporcional para o gráfico circular
            const pieSize = 200; // Tamanho ajustado
            const pieXPosition = (doc.internal.pageSize.getWidth() - pieSize) / 2; // Centralizar horizontalmente

            // Adicionar gráfico de pizza com proporções corretas
            doc.addImage(pieImgData, 'PNG', pieXPosition, 30, pieSize, pieSize / 2); // Gráfico de pizza ajustado

            // Adicionar dados de insights
            const insightsData = [
              ['Preço Médio', insights.averagePrice.toFixed(2)],
              ['Preço Mínimo', `${insights.minPrice.toFixed(2)} (${insights.minPricePosto})`],
              ['Preço Máximo', `${insights.maxPrice.toFixed(2)} (${insights.maxPricePosto})`],
              ['Diferença Máx-Mín', `${insights.priceDifference.toFixed(2)} (${insights.percentageDifference.toFixed(2)}%)`],
              ['Desvio Padrão', insights.standardDeviation.toFixed(2)],
              ['Número de Postos', insights.numberOfPostos],
            ];

            (doc as any).autoTable({
              head: [['Insight', 'Valor']],
              body: insightsData,
              startY: 140,  // Ajustado para que a tabela fique logo abaixo do gráfico de pizza
              margin: { top: 10 }
            });
          }

          // Adicionar nova página se não for o último gráfico
          if (i < this.charts.length - 1) {
            doc.addPage();
          }
        } catch (error) {
          console.error('Erro ao capturar o gráfico:', error);
        }
      }
    }

    // Salvar o PDF
    doc.save(`relatorio_precos_${new Date().getTime()}.pdf`);
  }

  exportToCSV(): void {
    this.openWarningDialog();
  }

  exportToExcel(): void {
    this.openWarningDialog();
  }

  openWarningDialog(): void {
    this.dialog.open(ModalAlertComponent);
  }
}
