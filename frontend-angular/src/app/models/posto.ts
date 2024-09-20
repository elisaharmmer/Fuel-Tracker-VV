import {PrecoColetado} from "./preco-coletado";
import {CombustivelDetalhado} from "./combustivel-detalhado";

export interface Posto {
  id: number;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  bandeira: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  precosColetados: PrecoColetado[];
}

export interface PostoCombustivelDetalhado {
  posto_id: number;
  posto_nome: string;
  posto_logradouro?: string;
  posto_numero?: string;
  posto_bairro?: string;
  posto_bandeira?: string;
  posto_cidade?: string;
  posto_estado?: string;
  posto_cep?: string;
  combustiveis: CombustivelDetalhado[];
}
