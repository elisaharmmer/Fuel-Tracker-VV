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
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['combustivel', 'preco', 'data_coleta'];
  chart: any;

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(
    private route: ActivatedRoute,
    private gasStationService: GasStationService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    const postoId = +this.route.snapshot.paramMap.get('id')!;
    this.gasStationService.getPostoDetalhes(postoId).subscribe(data => {
      this.posto = data;
      const combinedData = Object.keys(data.combustiveis).flatMap(combustivelNome =>
        data.combustiveis[combustivelNome].map((item: any) => ({
          combustivel: combustivelNome,
          preco: item.preco,
          data_coleta: new Date(item.data_coleta).toLocaleDateString('pt-BR')
        }))
      );
      this.dataSource.data = combinedData;
      this.createChart(data.combustiveis); // Criar o gráfico após carregar os dados
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
      fill: false
    }));

    this.chart = new Chart('combustiveisChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Preço (R$)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Data da Coleta'
            }
          }
        }
      }
    });
  }

  // Função para gerar uma cor aleatória
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
