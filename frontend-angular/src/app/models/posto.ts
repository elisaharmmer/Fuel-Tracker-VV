import {PrecoColetado} from "./preco-coletado";

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
