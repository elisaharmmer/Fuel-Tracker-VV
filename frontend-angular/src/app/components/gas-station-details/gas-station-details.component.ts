import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GasStationService } from '../../services/gas-station.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Chart } from 'chart.js/auto';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import html2canvas from 'html2canvas';
import {DownloadEventService} from "../../services/download-event.service";
import {Subscription} from "rxjs";

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

  private downloadSubscription: Subscription = new Subscription();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private gasStationService: GasStationService,
    private downloadEventService: DownloadEventService
  ) {}

  ngOnInit(): void {
    const postoId = +this.route.snapshot.paramMap.get('id')!;

    this.downloadSubscription = this.downloadEventService.downloadEvent$.subscribe(type => {
      if (type === 'pdf') {
        this.exportToPDF();
      } else if (type === 'csv') {
        this.exportToCSV();
      } else if (type === 'excel') {
        this.exportToExcel();
      }
    });

    this.gasStationService.getPostoDetalhes(postoId).subscribe(data => {
      this.posto = data;
      this.combustiveis = data.combustiveis;

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

  // Função de exportação para CSV
  exportToCSV(): void {
    const csvData = this.convertToCSV(this.dataSource.data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `dados_posto_${new Date().getTime()}.csv`);
  }

  convertToCSV(data: any[]): string {
    const header = 'Combustível;Preço;Data da Coleta\n';
    const rows = data.map(item => [
      item.combustivel,
      item.preco ? `R$ ${item.preco.replace('.', ',')}` : 'N/A',
      item.data_coleta
    ].join(';')).join('\n');
    return header + rows;
  }

  // Função de exportação para Excel
  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.getDataForExport());
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'dados_posto');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }

  // Função de exportação para PDF (incluindo gráficos e tabelas)
  async exportToPDF(): Promise<void> {
    const doc = new jsPDF();

    // Adiciona os detalhes do posto
    doc.text(`Detalhes do Posto: ${this.posto.nome_fantasia}`, 10, 10);
    doc.text(`Endereço: ${this.posto.logradouro}, ${this.posto.numero}, ${this.posto.bairro}`, 10, 20);

    // Capturar e adicionar o gráfico
    const canvasElement = document.getElementById('combustiveisChart') as HTMLCanvasElement;
    const canvas = await html2canvas(canvasElement);
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, 30, 180, 100);

    // Adicionar as estatísticas em formato de tabela
    const estatisticas = Object.keys(this.combustivelStats).map(combustivel => {
      const stats = this.combustivelStats[combustivel];
      return [
        combustivel,
        `R$ ${stats.maximum.replace('.', ',')}`, stats.maxDate ? new Date(stats.maxDate).toLocaleDateString('pt-BR') : 'N/A',
        `R$ ${stats.minimum.replace('.', ',')}`, stats.minDate ? new Date(stats.minDate).toLocaleDateString('pt-BR') : 'N/A',
        `R$ ${stats.average.replace('.', ',')}`
      ];
    });

    const estatisticasHeaders = [
      ['Combustível', 'Máxima (R$)', 'Data Coleta (Máx)', 'Mínima (R$)', 'Data Coleta (Mín)', 'Média (R$)']
    ];

    (doc as any).autoTable({
      head: estatisticasHeaders,
      body: estatisticas,
      startY: 140,  // Após o gráfico
      margin: { top: 10 }
    });

    // Adicionar os dados da tabela (Combustível, Preço e Data de Coleta)
    const tableData = this.dataSource.data.map(item => [
      item.combustivel,
      `R$ ${item.preco.replace('.', ',')}`,
      item.data_coleta
    ]);

    (doc as any).autoTable({
      head: [['Combustível', 'Preço', 'Data de Coleta']],
      body: tableData,
      startY: (doc as any).lastAutoTable.finalY + 10
    });

    // Salvar o PDF
    doc.save(`posto_detalhes_${new Date().getTime()}.pdf`);
  }

  getDataForExport(): any[] {
    return this.dataSource.data.map(item => ({
      Combustível: item.combustivel,
      Preço: item.preco ? `R$ ${item.preco.replace('.', ',')}` : 'N/A',
      'Data de Coleta': item.data_coleta
    }));
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
