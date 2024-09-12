import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {PrecoColetado} from "../entities/preco-coletado.entity";
import {Posto} from "../entities/posto.entity";
import {Combustivel} from "../entities/combustivel.entity";


@Injectable()
export class PrecoService {
    constructor(
        @InjectRepository(PrecoColetado)
        private precoRepository: Repository<PrecoColetado>,
        @InjectRepository(Posto)
        private postoRepository: Repository<Posto>,
        @InjectRepository(Combustivel)
        private combustivelRepository: Repository<Combustivel>,
    ) {}

    async findMenorPrecoPorCombustivel(bairro?: string, nomeCombustivel?: string) {
        const query = this.precoRepository.createQueryBuilder('preco')
            .leftJoinAndSelect('preco.posto', 'posto')
            .leftJoinAndSelect('preco.combustivel', 'combustivel')
            .select([
                'posto.nomeFantasia',
                'posto.logradouro',
                'posto.bairro',
                'combustivel.nome',
                'MIN(preco.preco) AS menorpreco',
                'preco.dataColeta',
            ])
            .groupBy('posto.nomeFantasia, posto.logradouro, posto.bairro, combustivel.nome, preco.dataColeta')
            .orderBy('combustivel.nome', 'ASC')
            .addOrderBy('preco.dataColeta', 'ASC');

        // Aplicar os filtros opcionais de bairro e combustível
        if (bairro) {
            query.andWhere('LOWER(posto.bairro) = LOWER(:bairro)', { bairro });
        }

        if (nomeCombustivel) {
            query.andWhere('LOWER(combustivel.nome) = LOWER(:nomeCombustivel)', { nomeCombustivel });
        }

        return query.getRawMany();
    }
}
