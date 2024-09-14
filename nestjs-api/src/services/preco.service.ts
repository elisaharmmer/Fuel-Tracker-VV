import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, DataSource } from 'typeorm';
import { PrecoColetado } from '../entities/preco-coletado.entity';
import { Posto } from '../entities/posto.entity';
import { Combustivel } from '../entities/combustivel.entity';

@Injectable()
export class PrecoService {
  constructor(
    @InjectRepository(PrecoColetado) private precoRepository: Repository<PrecoColetado>,
    @InjectRepository(Posto) private postoRepository: Repository<Posto>,
    @InjectRepository(Combustivel) private combustivelRepository: Repository<Combustivel>,
    private dataSource: DataSource
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

  async getMediaBairro(bairro: string, combustivel: string) {

      return await this.postoRepository.createQueryBuilder('po')
        .select([
          'po.NomeFantasia AS nome_posto',
          'po.Logradouro AS logradouro',
          'po.Numero AS numero',
          'po.Bairro AS bairro',
          'po.Cidade AS cidade',
          'po.Estado AS estado',
          'po.CEP AS cep',
          'co.Nome AS nome_combustivel',
          'ROUND(MIN(pc.Preco), 3) AS menor_preco',
          "TO_CHAR(pc.DataColeta, 'YYYY-MM') AS mes_coleta"
        ])
        .innerJoin(PrecoColetado, 'pc', 'po.ID_Posto = pc.PostoID')
        .innerJoin(Combustivel, 'co', 'pc.CombustivelID = co.ID_Combustivel')
        .where('po.Bairro = :bairro', { bairro: bairro })
        .andWhere('co.Nome = :nome_combustivel', { nome_combustivel: combustivel })
        .groupBy('po.NomeFantasia')
        .addGroupBy('po.Logradouro')
        .addGroupBy('po.Numero')
        .addGroupBy('po.Bairro')
        .addGroupBy('po.Cidade')
        .addGroupBy('po.Estado')
        .addGroupBy('po.CEP')
        .addGroupBy('co.Nome')
        .addGroupBy("TO_CHAR(pc.DataColeta, 'YYYY-MM')")
        .orderBy('mes_coleta', 'DESC')
        .getRawMany();
  }

  async getMediaMensal() {

    return await this.precoRepository.createQueryBuilder('pc')
      .select("TO_CHAR(pc.DataColeta, 'YYYY-MM')", 'mes_coleta')
      .addSelect('co.Nome', 'nome_combustivel')
      .addSelect('ROUND(AVG(pc.Preco), 3)', 'preco_medio')
      .innerJoin(Combustivel, 'co', 'pc.CombustivelID = co.ID_Combustivel')
      .groupBy("TO_CHAR(pc.DataColeta, 'YYYY-MM')")
      .addGroupBy('co.Nome')
      .orderBy('mes_coleta', 'DESC')
      .getRawMany();
  }

  async getMediaCombustivel(mes?: string, ano?: string) {
    const query = this.precoRepository.createQueryBuilder('pc')
      .select('co."Nome"', 'nome_combustivel')
      .addSelect('ROUND(AVG(pc."Preco"), 3)', 'preco_medio')
      .innerJoin(Combustivel, 'co', 'pc."CombustivelID" = co."ID_Combustivel"');

    if (mes && ano) {
      query.where('TO_CHAR(pc."DataColeta", \'MM\') = :mes', { mes })
        .andWhere('TO_CHAR(pc."DataColeta", \'YYYY\') = :ano', { ano });
    }

    query.groupBy('co."Nome"');

    return await query.getRawMany();
  }

  async getMenorPrecoCombustivel(bairro?: string, combustivel?: string) {
    const rawResults = await this.postoRepository.createQueryBuilder('po')
      .select([
        'po.NomeFantasia AS nome_posto',
        'po.Logradouro AS logradouro',
        'po.Numero AS numero',
        'po.Bairro AS bairro',
        'po.Cidade AS cidade',
        'po.Estado AS estado',
        'po.CEP AS cep',
        'co.Nome AS nome_combustivel',
        'ROUND(pc.Preco, 3) AS menor_preco',
        'pc.DataColeta AS data_coleta'
      ])
      .innerJoin(PrecoColetado, 'pc', 'po.ID_Posto = pc.PostoID')
      .innerJoin(Combustivel, 'co', 'pc.CombustivelID = co.ID_Combustivel')
      .where('pc.DataColeta = (SELECT MAX(pc2."DataColeta") FROM public."PRECO_COLETADO" pc2 WHERE pc2."PostoID" = po."ID_Posto" AND pc2."CombustivelID" = co."ID_Combustivel")')
      .orderBy('menor_preco', 'ASC');

    if (bairro) {
      rawResults.andWhere('po.Bairro = :bairro', { bairro });
    }

    if (combustivel) {
      rawResults.andWhere('co.Nome = :nome', { nome: combustivel });
    }

    const results = await rawResults.getRawMany();

    // Agrupar resultados por posto
    const groupedResults = results.reduce((acc, curr) => {
      const postoKey = `${curr.nome_posto}-${curr.logradouro}`;

      if (!acc[postoKey]) {
        acc[postoKey] = {
          nome_posto: curr.nome_posto,
          logradouro: curr.logradouro,
          numero: curr.numero,
          bairro: curr.bairro,
          cidade: curr.cidade,
          estado: curr.estado,
          cep: curr.cep,
          combustiveis: [],
        };
      }

      acc[postoKey].combustiveis.push({
        nome_combustivel: curr.nome_combustivel,
        menor_preco: curr.menor_preco,
        data_coleta: curr.data_coleta,
      });

      return acc;
    }, {});
    return Object.values(groupedResults);
  }

  async getMesesAnosDisponiveis() {
    return await this.precoRepository.createQueryBuilder('pc')
      .select('DISTINCT TO_CHAR(pc."DataColeta", \'MM\')', 'mes')
      .addSelect('TO_CHAR(pc."DataColeta", \'YYYY\')', 'ano')
      .orderBy('ano', 'ASC')
      .addOrderBy('mes', 'ASC')
      .getRawMany();
  }
}
