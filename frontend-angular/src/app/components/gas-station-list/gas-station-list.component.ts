import { Component, OnInit } from '@angular/core';
import {Posto} from "../../models/posto";
import {GasStationService} from "../../services/gas-station.service";
import {Combustivel} from "../../models/combustivel";

@Component({
  selector: 'app-gas-station-list',
  templateUrl: './gas-station-list.component.html',
  styleUrls: ['./gas-station-list.component.scss']
})
export class GasStationListComponent implements OnInit {
  gasStations: Posto[] = [];
  neighborhoods: string[] = [];
  fuelTypes: string[] = [];

  searchTerm = '';
  selectedNeighborhood = '';
  selectedFuelType = '';

  filteredOptions: string[] = [];
  filteredGasStations: Posto[] = [];

  constructor(private gasStationService: GasStationService) {}

  ngOnInit(): void {
    this.loadGasStations();
    this.loadCombustiveis();
    this.loadBairros();
  }

  loadGasStations() {
    this.gasStationService.getPostos().subscribe(
      (data: Posto[]) => {
        this.gasStations = data;
        this.filteredGasStations = this.gasStations;
        this.filteredOptions = this.gasStations.map(station => station.nomeFantasia);
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
      const matchesSearch = station.nomeFantasia.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesNeighborhood = !this.selectedNeighborhood || station.bairro === this.selectedNeighborhood;
      const matchesFuelType = !this.selectedFuelType ||
        station.precosColetados.some(preco => preco.combustivel.nome.toLowerCase().includes(this.selectedFuelType.toLowerCase()));
      return matchesSearch && matchesNeighborhood && matchesFuelType;
    });
  }
}
