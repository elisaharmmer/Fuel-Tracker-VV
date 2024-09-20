import { Posto } from './posto';
import { Combustivel } from './combustivel';

export interface PrecoColetado {
  id: number;
  preco: number;
  unidadeMedida: string;
  dataColeta: Date;
  posto: Posto;
  combustivel: Combustivel;
}
