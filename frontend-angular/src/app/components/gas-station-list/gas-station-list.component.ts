import { Component, OnInit } from '@angular/core';
import { GasStationService } from "../../services/gas-station.service";
import {PostoCombustivelDetalhado} from "../../models/posto";
import {Combustivel} from "../../models/combustivel";

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


}
