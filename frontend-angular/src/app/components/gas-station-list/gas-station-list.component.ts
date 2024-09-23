import { Component, OnInit } from '@angular/core';
import { GasStationService } from "../../services/gas-station.service";
import {PostoCombustivelDetalhado} from "../../models/posto";
import {Combustivel} from "../../models/combustivel";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-gas-station-list',
  templateUrl: './gas-station-list.component.html',
  styleUrls: ['./gas-station-list.component.scss']
})
export class GasStationListComponent implements OnInit {
  gasStations: PostoCombustivelDetalhado[] = [];
  neighborhoods: string[] = [];
  fuelTypes: string[] = [];

  searchTerm = '';
  selectedNeighborhood = '';
  selectedFuelType = '';

  filteredOptions: string[] = [];
  filteredGasStations: PostoCombustivelDetalhado[] = [];

  constructor(private gasStationService: GasStationService) {}

  ngOnInit(): void {
    this.loadGasStations();
    this.loadCombustiveis();
    this.loadBairros();
  }

  loadGasStations() {
    this.gasStationService.getPostosDetalhados().subscribe(
      (data: PostoCombustivelDetalhado[]) => {
        this.gasStations = data;
        this.filteredGasStations = this.gasStations;
        this.filteredOptions = this.gasStations.map(station => station.posto_nome);
      },
      (error) => {
        console.error('Erro ao buscar os postos', error);
      }
    );
  }

  loadCombustiveis() {
    this.gasStationService.getCombustiveis().subscribe(
      (data: Combustivel[]) => {
        this.fuelTypes = data.map(combustivel => combustivel.nome);
      },
      (error) => {
        console.error('Erro ao buscar os combustíveis', error);
      }
    );
  }

  loadBairros() {
    this.gasStationService.getBairros().subscribe(
      (data: { bairro: string }[]) => {
        this.neighborhoods = data.map(b => b.bairro);
      },
      (error) => {
        console.error('Erro ao buscar os bairros', error);
      }
    );
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedNeighborhood = '';
    this.selectedFuelType = '';
    this.filterStations(); // Atualiza a lista com todos os postos
  }

  clearFilter(filterType: string) {
    switch (filterType) {
      case 'searchTerm':
        this.searchTerm = '';
        break;
      case 'neighborhood':
        this.selectedNeighborhood = '';
        this.searchTerm = ''; // Limpa também o autocomplete
        break;
      case 'fuelType':
        this.selectedFuelType = '';
        break;
    }
    this.filterStations();
  }


  filterStations() {
    // Verifica se o bairro foi alterado e limpa o campo de busca
    if (this.selectedNeighborhood) {
      this.searchTerm = ''; // Limpa o valor selecionado no autocomplete
    }

    this.filteredGasStations = this.gasStations.filter(station => {
      const matchesSearch = station.posto_nome.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesNeighborhood = !this.selectedNeighborhood || station.posto_bairro === this.selectedNeighborhood;
      const matchesFuelType = !this.selectedFuelType || station.combustiveis.some(combustivel => combustivel.combustivel_nome.toLowerCase().includes(this.selectedFuelType.toLowerCase()));
      return matchesSearch && matchesNeighborhood && matchesFuelType;
    });

    // Atualiza as opções do autocomplete para mostrar apenas os postos do bairro selecionado
    this.filteredOptions = this.filteredGasStations.map(station => station.posto_nome);
  }

  exportToExcel(): void {
    const dataToExport = this.filteredGasStations; // Substitua 'this.data' com a variável que contém os dados que deseja exportar
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'dados_exportados');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/octet-stream'
    });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }

  exportToPDF(): void {
    const doc = new jsPDF();

    // Colunas e linhas baseadas na sua fonte de dados
    const colunas = Object.keys(this.filteredGasStations[0]);
    const linhas = this.filteredGasStations.map((row: any) => colunas.map(col => row[col]));

    // AutoTabela para adicionar os dados no PDF
    (doc as any).autoTable({
      head: [colunas],
      body: linhas
    });

    // Salvar o PDF com um nome único
    doc.save(`dados_exportados_${new Date().getTime()}.pdf`);
  }



}
