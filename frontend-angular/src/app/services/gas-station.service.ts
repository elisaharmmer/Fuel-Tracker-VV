// gas-station.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Posto, PostoCombustivelDetalhado } from '../models/posto';
import { Combustivel } from '../models/combustivel';
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class GasStationService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  getPostosDetalhados(): Observable<PostoCombustivelDetalhado[]> {
    return this.http.get<PostoCombustivelDetalhado[]>(`${this.apiUrl}/postos`);
  }

  getCombustiveis(): Observable<Combustivel[]> {
    return this.http.get<Combustivel[]>(`${this.apiUrl}/combustiveis`);
  }

  getBairros(): Observable<{ bairro: string }[]> {
    return this.http.get<{ bairro: string }[]>(`${this.apiUrl}/bairros`);
  }

  getPostoDetalhes(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/postos/${id}`);
  }

  getAveragePriceByPosto(dataInicio: string, dataFim: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/insights/preco-medio-por-posto?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  getPriceVariationByPosto(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/insights/variacao-preco-por-posto`);
  }
}
