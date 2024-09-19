import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posto } from '../entities/posto.entity';
import {PrecoColetado} from "../entities/preco-coletado.entity";
import {Combustivel} from "../entities/combustivel.entity";

@Injectable()
export class PostoService {
    constructor(
        @InjectRepository(Posto) private readonly postoRepository: Repository<Posto>,
    ) {}

    async getAllPostos(): Promise<any[]> {
        // Step 1: Buscar dados do banco de dados
        const rawResults = await this.postoRepository.createQueryBuilder('p')
            .select([
                'p."ID_Posto" AS posto_id',
                'p."NomeFantasia" AS posto_nome',
                'p."Bandeira" AS posto_bandeira',
                'p."Logradouro" AS posto_logradouro',
                'p."Numero" AS posto_numero',
                'p."Bairro" AS posto_bairro',
                'p."Cidade" AS posto_cidade',
                'p."Estado" AS posto_estado',
                'p."CEP" AS posto_cep',
                'c."Nome" AS combustivel_nome',
                'pc."Preco" AS preco',
                'pc."DataColeta" AS data_coleta'
            ])
            .leftJoin(Combustivel, 'c', 'TRUE') // LEFT JOIN COMBUSTIVEL ON TRUE
            .leftJoin(
                qb => {
                    return qb
                        .select([
                            'pc_inner."PostoID"',
                            'pc_inner."CombustivelID"',
                            'pc_inner."Preco"',
                            'pc_inner."DataColeta"'
                        ])
                        .from(PrecoColetado, 'pc_inner')
                        .where(`(pc_inner."PostoID", pc_inner."CombustivelID", pc_inner."DataColeta") IN (
                        SELECT 
                            pc_sub."PostoID", 
                            pc_sub."CombustivelID", 
                            MAX(pc_sub."DataColeta") 
                        FROM 
                            "PRECO_COLETADO" pc_sub 
                        GROUP BY 
                            pc_sub."PostoID", pc_sub."CombustivelID"
                    )`);
                },
                'pc',
                'pc."PostoID" = p."ID_Posto" AND pc."CombustivelID" = c."ID_Combustivel"'
            )
            .orderBy('p."ID_Posto"', 'ASC')
            .addOrderBy('c."Nome"', 'ASC')
            .getRawMany();

        // Step 2: Agrupar os combustíveis por posto
        const postosMap = new Map<number, any>();

        rawResults.forEach(result => {
            const {
                posto_id,
                posto_nome,
                posto_bandeira,
                posto_logradouro,
                posto_numero,
                posto_bairro,
                posto_cidade,
                posto_estado,
                posto_cep,
                combustivel_nome,
                preco,
                data_coleta
            } = result;

            if (!postosMap.has(posto_id)) {
                postosMap.set(posto_id, {
                    posto_id,
                    posto_nome,
                    posto_bandeira,
                    posto_logradouro,
                    posto_numero,
                    posto_bairro,
                    posto_cidade,
                    posto_estado,
                    posto_cep,
                    combustiveis: []
                });
            }

            postosMap.get(posto_id).combustiveis.push({
                combustivel_nome,
                preco,
                data_coleta
            });
        });

        // Step 3: Converter o mapa em um array
        return Array.from(postosMap.values());
    }

    getRelatorioPostos(dataInicio: string, dataFim: string): Promise<any[]> {
        return this.postoRepository.query(`EXEC sp_ResumoPostosEPrecos @DataInicio = '${dataInicio}', @DataFim = '${dataFim}'`);
    }
}
