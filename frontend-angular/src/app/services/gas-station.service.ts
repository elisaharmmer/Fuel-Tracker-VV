import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Posto, PostoCombustivelDetalhado} from '../models/posto';
import { Combustivel } from '../models/combustivel';

@Injectable({
  providedIn: 'root'
})
export class GasStationService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPostos(): Observable<Posto[]> {
    return this.http.get<Posto[]>(`${this.apiUrl}/postos`);
  }

  getPostosDetalhados(): Observable<PostoCombustivelDetalhado[]> {
    return this.http.get<PostoCombustivelDetalhado[]>(`${this.apiUrl}/postos`);
  }

  getCombustiveis(): Observable<Combustivel[]> {
    return this.http.get<Combustivel[]>(`${this.apiUrl}/combustiveis`);
  }

  getBairros(): Observable<{ bairro: string }[]> {
    return this.http.get<{ bairro: string }[]>(`${this.apiUrl}/bairros`);
  }
}
