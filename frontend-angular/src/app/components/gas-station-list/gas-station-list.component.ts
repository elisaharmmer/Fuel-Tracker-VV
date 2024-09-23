import { Component, OnInit, OnDestroy } from '@angular/core';
import { GasStationService } from "../../services/gas-station.service";
import { PostoCombustivelDetalhado } from "../../models/posto";
import { Combustivel } from "../../models/combustivel";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Subscription } from "rxjs";
import { DownloadEventService } from "../../services/download-event.service";
import * as moment from 'moment';

@Component({
  selector: 'app-gas-station-list',
  templateUrl: './gas-station-list.component.html',
  styleUrls: ['./gas-station-list.component.scss']
})
export class GasStationListComponent implements OnInit, OnDestroy {
  gasStations: PostoCombustivelDetalhado[] = [];
  neighborhoods: string[] = [];
  fuelTypes: string[] = [];
  searchTerm = '';
  selectedNeighborhood = '';
  selectedFuelType = '';
  filteredOptions: string[] = [];
  filteredGasStations: PostoCombustivelDetalhado[] = [];
  private downloadSubscription: Subscription = new Subscription();

  constructor(
    private gasStationService: GasStationService,
    private downloadEventService: DownloadEventService
  ) {}

  ngOnInit(): void {
    this.downloadSubscription = this.downloadEventService.downloadEvent$.subscribe(type => {
      if (type === 'pdf') {
        this.exportToPDF();
      } else if (type === 'csv') {
        this.exportToCSV();
      } else if (type === 'excel') {
        this.exportToExcel();
      }
    });

    this.loadGasStations();
    this.loadCombustiveis();
    this.loadBairros();
  }

  ngOnDestroy(): void {
    if (this.downloadSubscription) {
      this.downloadSubscription.unsubscribe();
    }
  }

  loadGasStations() {
    this.gasStationService.getPostosDetalhados().subscribe(
      (data: PostoCombustivelDetalhado[]) => {
        this.gasStations = data;
        this.filteredGasStations = this.gasStations;
        this.filteredOptions = this.gasStations.map(station => station.posto_nome);
      },
      error => {
        console.error('Erro ao buscar os postos', error);
      }
    );
  }

  loadCombustiveis() {
    this.gasStationService.getCombustiveis().subscribe(
      (data: Combustivel[]) => {
        this.fuelTypes = data.map(combustivel => combustivel.nome);
      },
      error => {
        console.error('Erro ao buscar os combustíveis', error);
      }
    );
  }

  loadBairros() {
    this.gasStationService.getBairros().subscribe(
      (data: { bairro: string }[]) => {
        this.neighborhoods = data.map(b => b.bairro);
      },
      error => {
        console.error('Erro ao buscar os bairros', error);
      }
    );
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedNeighborhood = '';
    this.selectedFuelType = '';
    this.filterStations();
  }

  clearFilter(filterType: string) {
    switch (filterType) {
      case 'searchTerm':
        this.searchTerm = '';
        break;
      case 'neighborhood':
        this.selectedNeighborhood = '';
        this.searchTerm = '';
        break;
      case 'fuelType':
        this.selectedFuelType = '';
        break;
    }
    this.filterStations();
  }

  filterStations() {
    if (this.selectedNeighborhood) {
      this.searchTerm = '';
    }

    this.filteredGasStations = this.gasStations.filter(station => {
      const matchesSearch = station.posto_nome.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesNeighborhood = !this.selectedNeighborhood || station.posto_bairro === this.selectedNeighborhood;
      const matchesFuelType = !this.selectedFuelType || station.combustiveis.some(combustivel =>
        combustivel.combustivel_nome.toLowerCase().includes(this.selectedFuelType.toLowerCase())
      );
      return matchesSearch && matchesNeighborhood && matchesFuelType;
    });

    this.filteredOptions = this.filteredGasStations.map(station => station.posto_nome);
  }

  exportToExcel(): void {
    const dataToExport = this.getDataForExport();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'dados_exportados');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    const colunasPrincipais = ['Posto', 'Bairro'];
    let currentY = 10; // Posição inicial no eixo Y

    this.filteredGasStations.forEach(station => {
      const linhasPrincipais = [
        [station.posto_nome, station.posto_bairro]
      ];

      // Tabela principal para Posto e Bairro
      (doc as any).autoTable({
        head: [colunasPrincipais],
        body: linhasPrincipais,
        startY: currentY
      });

      // Atualiza currentY para a posição após a tabela principal
      currentY = (doc as any).lastAutoTable.finalY + 5;

      // Subtabela para Combustíveis
      const colunasCombustivel = ['Combustível', 'Data de Coleta', 'Valor'];
      const linhasCombustivel = station.combustiveis.map(combustivel => [
        combustivel.combustivel_nome,
        combustivel.data_coleta ? moment(combustivel.data_coleta).format('DD/MM/YYYY') : 'N/A',
        combustivel.preco ? `R$ ${combustivel.preco.replace('.', ',')}` : 'N/A'
      ]);

      // Inserindo a subtabela com os combustíveis
      (doc as any).autoTable({
        head: [colunasCombustivel],
        body: linhasCombustivel,
        startY: currentY,
        theme: 'grid'
      });

      // Atualiza currentY para a posição após a subtabela
      currentY = (doc as any).lastAutoTable.finalY + 10;
    });

    // Salvar o PDF
    doc.save(`dados_exportados_${moment().format('DD-MM-YYYY-h-mm-ss-ms')}.pdf`);
  }

  getDataForExport(): any[] {
    const dataToExport: any[] = [];

    this.filteredGasStations.forEach(station => {
      station.combustiveis.forEach(combustivel => {
        dataToExport.push({
          Posto: station.posto_nome,
          Bairro: station.posto_bairro,
          Combustível: combustivel.combustivel_nome,
          'Data de Coleta': combustivel.data_coleta
            ? moment(combustivel.data_coleta).format('DD/MM/YYYY')
            : 'N/A',
          Valor: combustivel.preco
            ? `R$ ${combustivel.preco.replace('.', ',')}`
            : 'N/A'
        });
      });
    });

    return dataToExport;
  }

  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(';') + '\n'; // Usa ponto e vírgula como separador
    const rows = data.map(row => Object.values(row).join(';')).join('\n');
    return header + rows;
  }

  exportToCSV(): void {
    const dataToExport = this.getDataForExport();
    const csvData = this.convertToCSV(dataToExport);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `dados_exportados_${new Date().getTime()}.csv`);
  }

}
