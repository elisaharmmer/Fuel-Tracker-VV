import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, DataSource } from 'typeorm';
import { PrecoColetado } from '../entities/preco-coletado.entity';
import { Posto } from '../entities/posto.entity';
import { Combustivel } from '../entities/combustivel.entity';

@Injectable()
export class UtilService {
  constructor(
    @InjectRepository(PrecoColetado) private precoRepository: Repository<PrecoColetado>,
    @InjectRepository(Posto) private postoRepository: Repository<Posto>,
    @InjectRepository(Combustivel) private combustivelRepository: Repository<Combustivel>,
  ) {}

  async getAll() {
    return [
      {
        nome: 'combustivies',
        rota: '/combustiveis',
        parametros: null,
        descricao: 'Retorna todos os combustíveis disponíveis'
      },
      {
        nome: 'datas',
        rota: '/datas',
        parametros: null,
        descricao: 'Retorna todas as datas com mês e ano disponível'
      },{
        nome: 'bairros',
        rota: '/bairros',
        parametros: null,
        descricao: 'Retorna todos os bairros disponiveis'
      },
    ];
  }

  async getMesesAnosDisponiveis() {
    return await this.precoRepository.createQueryBuilder('pc')
      .select('DISTINCT TO_CHAR(pc."DataColeta", \'MM\')', 'mes')
      .addSelect('TO_CHAR(pc."DataColeta", \'YYYY\')', 'ano')
      .orderBy('ano', 'ASC')
      .addOrderBy('mes', 'ASC')
      .getRawMany();
  }

  async getBairrosDisponiveis() {
    return await this.postoRepository.createQueryBuilder('po')
      .select('DISTINCT po.Bairro', 'bairro')
      .orderBy('po.Bairro', 'ASC')
      .getRawMany();
  }
}
