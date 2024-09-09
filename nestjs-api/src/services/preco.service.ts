import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrecoColetado } from '../entities/preco-coletado.entity';

@Injectable()
export class PrecoService {
    constructor(
        @InjectRepository(PrecoColetado)
        private readonly precoRepository: Repository<PrecoColetado>,
    ) {}

    getMenorPreco(bairro?: string, combustivel?: string): Promise<any[]> {
        return this.precoRepository.query(
            `EXEC sp_MenorPrecoPorCombustivel @Bairro = ${bairro ? `'${bairro}'` : 'NULL'}, @NomeCombustivel = ${combustivel ? `'${combustivel}'` : 'NULL'}`,
        );
    }

    getMediaPreco(bairro?: string, dataInicio?: string, dataFim?: string): Promise<any[]> {
        return this.precoRepository.query(
            `EXEC sp_PrecoMedioCombustivel @Bairro = ${bairro ? `'${bairro}'` : 'NULL'}, @DataInicio = ${dataInicio ? `'${dataInicio}'` : 'NULL'}, @DataFim = ${dataFim ? `'${dataFim}'` : 'NULL'}`,
        );
    }
}
