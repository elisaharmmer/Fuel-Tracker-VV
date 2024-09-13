import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';  // Importa o operador LessThanOrEqual
import { PrecoColetado } from '../entities/preco-coletado.entity';
import { Posto } from '../entities/posto.entity';
import { Combustivel } from '../entities/combustivel.entity';

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

  // Método getAll com paginação e ordenação por data decrescente
  async getAll(page = 1, limit = 50) {
    const today = new Date();
    const skip = (page - 1) * limit;

    return await this.precoRepository.find({
      relations: ['posto', 'combustivel'],
      where: { dataColeta: LessThanOrEqual(today) },
      order: { dataColeta: 'DESC' },
      skip,
      take: limit,  // Limite de resultados por página (50 por padrão)
    });
  }

  // Método para encontrar o menor preço por combustível
  async findMenorPrecoPorCombustivel(
    bairro?: string,
    nomeCombustivel?: string,
  ) {
    const query = this.precoRepository
      .createQueryBuilder('preco')
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
      .groupBy(
        'posto.nomeFantasia, posto.logradouro, posto.bairro, combustivel.nome, preco.dataColeta',
      )
      .orderBy('combustivel.nome', 'ASC')
      .addOrderBy('preco.dataColeta', 'DESC')
      .limit(50);

    if (bairro) {
      query.andWhere('LOWER(posto.bairro) = LOWER(:bairro)', { bairro });
    }

    if (nomeCombustivel) {
      query.andWhere('LOWER(combustivel.nome) = LOWER(:nomeCombustivel)', {
        nomeCombustivel,
      });
    }
    return query.getRawMany();
  }
}
