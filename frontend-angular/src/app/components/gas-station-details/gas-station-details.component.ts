import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GasStationService } from '../../services/gas-station.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-gas-station-details',
  templateUrl: './gas-station-details.component.html',
  styleUrls: ['./gas-station-details.component.scss']
})
export class GasStationDetailsComponent implements OnInit, AfterViewInit {
  posto: any;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['combustivel', 'preco', 'data_coleta'];
  chart: any;
  combustiveis: { [key: string]: any[] } = {}; // Adicionado para armazenar os combustíveis
  combustivelStats: any = {};

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private gasStationService: GasStationService
  ) {}

  ngOnInit(): void {
    const postoId = +this.route.snapshot.paramMap.get('id')!;
    this.gasStationService.getPostoDetalhes(postoId).subscribe(data => {
      this.posto = data;
      this.combustiveis = data.combustiveis; // Corrigido: Atribuir os dados dos combustíveis

      // Calcular estatísticas para cada combustível
      this.calculateStats();

      const combinedData = Object.keys(this.combustiveis).flatMap(combustivelNome =>
        this.combustiveis[combustivelNome].map((item: any) => ({
          combustivel: combustivelNome,
          preco: item.preco,
          data_coleta: new Date(item.data_coleta).toLocaleDateString('pt-BR')
        }))
      );
      this.dataSource.data = combinedData;
      this.createChart(this.combustiveis);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  calculateStats() {
    Object.keys(this.combustiveis).forEach(combustivelNome => {
      const precos = this.combustiveis[combustivelNome];
      const total = precos.reduce((sum, item) => sum + parseFloat(item.preco), 0);
      const avg = (total / precos.length).toFixed(2);
      const min = Math.min(...precos.map(item => parseFloat(item.preco)));
      const max = Math.max(...precos.map(item => parseFloat(item.preco)));

      // Encontrar as datas para os valores mínimo e máximo
      const minDate = precos
        .filter(item => parseFloat(item.preco) === min)
        .map(item => item.data_coleta)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];

      const maxDate = precos
        .filter(item => parseFloat(item.preco) === max)
        .map(item => item.data_coleta)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];

      this.combustivelStats[combustivelNome] = {
        average: avg,
        minimum: min.toFixed(2),
        maximum: max.toFixed(2),
        minDate: minDate,
        maxDate: maxDate
      };
    });
  }



  objectKeys(obj: any) {
    return Object.keys(obj);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createChart(combustiveis: any) {
    const labels = combustiveis[Object.keys(combustiveis)[0]].map((item: any) =>
      new Date(item.data_coleta).toLocaleDateString('pt-BR')
    );

    const datasets = Object.keys(combustiveis).map(combustivelNome => ({
      label: `Preço do ${combustivelNome}`,
      data: combustiveis[combustivelNome].map((item: any) => item.preco),
      borderColor: this.getRandomColor(),
      fill: false,
    }));

    const ctx = document.getElementById('combustiveisChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        // maintainAspectRatio: false, // Permite que o gráfico ajuste sua altura
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Preço (R$)',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Data da Coleta',
            },
          },
        },
      },
    });
  }


  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
