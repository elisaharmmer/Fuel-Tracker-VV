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
        console.log('Postos Detalhados', data);
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

  filterStations() {
    this.filteredGasStations = this.gasStations.filter(station => {
      const matchesSearch = station.posto_nome.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesNeighborhood = !this.selectedNeighborhood || station.posto_bairro === this.selectedNeighborhood;
      const matchesFuelType = !this.selectedFuelType ||
        station.combustiveis.some(combustivel => combustivel.combustivel_nome.toLowerCase().includes(this.selectedFuelType.toLowerCase()));
      return matchesSearch && matchesNeighborhood && matchesFuelType;
    });
  }
}
