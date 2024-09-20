import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrecoColetado } from '../entities/preco-coletado.entity';

@Injectable()
export class InsightsService {
    constructor(
        @InjectRepository(PrecoColetado)
        private readonly precoColetadoRepository: Repository<PrecoColetado>,
    ) {}

    // 1. Preço Médio por Posto em um Período de Tempo
    async getAveragePriceByPosto(startDate: string, endDate: string): Promise<any> {
        return await this.precoColetadoRepository.query(`
            SELECT
                p."NomeFantasia" AS posto,
                c."Nome" AS combustivel,
                ROUND(AVG(pc."Preco"), 2) AS preco_medio
            FROM "POSTO" p
                     JOIN "PRECO_COLETADO" pcv ON pcv."PostoID" = p."ID_Posto"
                     JOIN "COMBUSTIVEL" c ON pcv."CombustivelID" = c."ID_Combustivel"
                     LEFT JOIN "PRECO_COLETADO" pc ON pc."PostoID" = p."ID_Posto"
                AND pc."CombustivelID" = c."ID_Combustivel"
                AND pc."DataColeta" BETWEEN $1 AND $2
            GROUP BY p."NomeFantasia", c."Nome"
            ORDER BY preco_medio ASC;
        `, [startDate, endDate]);
    }

    // 2. Evolução do Preço dos Combustíveis em Cada Posto
    async getPriceEvolutionByPosto(postoId: number): Promise<any> {
        return this.precoColetadoRepository.query(`
            SELECT
                pc."DataColeta" AS data_coleta,
                c."Nome" AS combustivel,
                pc."Preco" AS preco
            FROM "PRECO_COLETADO" pc
                     JOIN "POSTO" p ON pc."PostoID" = p."ID_Posto"
                     JOIN "COMBUSTIVEL" c ON pc."CombustivelID" = c."ID_Combustivel"
            WHERE p."ID_Posto" = $1
            ORDER BY pc."DataColeta" ASC;
        `, [postoId]);
    }

    // 3. Postos com Maior Variação de Preço
    async getPriceVariationByPosto(): Promise<any> {
        return this.precoColetadoRepository.query(`
            SELECT
                p."NomeFantasia" AS posto,
                c."Nome" AS combustivel,
                MAX(pc."Preco") - MIN(pc."Preco") AS variacao
            FROM "PRECO_COLETADO" pc
                     JOIN "POSTO" p ON pc."PostoID" = p."ID_Posto"
                     JOIN "COMBUSTIVEL" c ON pc."CombustivelID" = c."ID_Combustivel"
            GROUP BY p."NomeFantasia", c."Nome"
            ORDER BY variacao DESC;
        `);
    }

    // 4. Comparação de Preço entre Combustíveis
    async compareFuelPrices(): Promise<any> {
        return this.precoColetadoRepository.query(`
            SELECT
                c."Nome" AS combustivel,
                ROUND(AVG(pc."Preco"), 2) AS preco_medio
            FROM "PRECO_COLETADO" pc
                     JOIN "COMBUSTIVEL" c ON pc."CombustivelID" = c."ID_Combustivel"
            GROUP BY c."Nome"
            ORDER BY preco_medio DESC;
        `);
    }

    // 5. Gráfico de Distribuição de Preços por Faixa
    async getPriceDistribution(combustivelId: number): Promise<any> {
        return this.precoColetadoRepository.query(`
            SELECT
                CASE
                    WHEN pc."Preco" BETWEEN 4.00 AND 4.50 THEN 'R$4.00 - R$4.50'
                    WHEN pc."Preco" BETWEEN 4.51 AND 5.00 THEN 'R$4.51 - R$5.00'
                    WHEN pc."Preco" BETWEEN 5.01 AND 5.50 THEN 'R$5.01 - R$5.50'
                    ELSE 'Acima de R$5.50'
                    END AS faixa_preco,
                COUNT(*) AS quantidade_postos
            FROM "PRECO_COLETADO" pc
            WHERE pc."CombustivelID" = $1
            GROUP BY faixa_preco
            ORDER BY faixa_preco;
        `, [combustivelId]);
    }

    // 6. Top 3 Postos Mais Baratos e Mais Caros
    async getTop3PostosCheapestAndExpensive(combustivelId: number): Promise<any> {
        const cheapest = await this.precoColetadoRepository.query(`
            SELECT
                p."NomeFantasia" AS posto,
                pc."Preco" AS preco
            FROM "PRECO_COLETADO" pc
                     JOIN "POSTO" p ON pc."PostoID" = p."ID_Posto"
            WHERE pc."CombustivelID" = $1
            ORDER BY pc."Preco" ASC
                LIMIT 3;
        `, [combustivelId]);

        const expensive = await this.precoColetadoRepository.query(`
            SELECT
                p."NomeFantasia" AS posto,
                pc."Preco" AS preco
            FROM "PRECO_COLETADO" pc
                     JOIN "POSTO" p ON pc."PostoID" = p."ID_Posto"
            WHERE pc."CombustivelID" = $1
            ORDER BY pc."Preco" DESC
                LIMIT 3;
        `, [combustivelId]);

        return { cheapest, expensive };
    }
}
