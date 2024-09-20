import {PrecoColetado} from "./preco-coletado";

export interface Combustivel {
  id: number;
  nome: string;
  precosColetados: PrecoColetado[];
}
