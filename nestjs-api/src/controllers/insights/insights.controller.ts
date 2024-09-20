import { Controller, Get, Query, Param } from '@nestjs/common';
import {InsightsService} from "../../services/insights.service";


@Controller('insights')
export class InsightsController {
    constructor(private readonly insightsService: InsightsService) {}

    // 1. Preço Médio por Posto em um Período
    @Get('preco-medio-por-posto')
    getAveragePriceByPosto(
        @Query('dataInicio') startDate: string,
        @Query('dataFim') endDate: string
    ) {
        return this.insightsService.getAveragePriceByPosto(startDate, endDate);
    }

    // 2. Evolução do Preço dos Combustíveis em Cada Posto
    @Get('evolucao-preco/:postoId')
    getPriceEvolutionByPosto(@Param('postoId') postoId: number) {
        return this.insightsService.getPriceEvolutionByPosto(postoId);
    }

    // 3. Postos com Maior Variação de Preço
    @Get('variacao-preco-por-posto')
    getPriceVariationByPosto() {
        return this.insightsService.getPriceVariationByPosto();
    }

    // 4. Comparação de Preço entre Combustíveis
    @Get('comparar-preco-combustiveis')
    compareFuelPrices() {
        return this.insightsService.compareFuelPrices();
    }

    // 5. Distribuição de Preços por Faixa
    @Get('distribuicao-preco/:combustivelId')
    getPriceDistribution(@Param('combustivelId') combustivelId: number) {
        return this.insightsService.getPriceDistribution(combustivelId);
    }

    // 6. Top 3 Postos Mais Baratos e Mais Caros
    @Get('top3-postos-baratos-caros/:combustivelId')
    getTop3PostosCheapestAndExpensive(@Param('combustivelId') combustivelId: number) {
        return this.insightsService.getTop3PostosCheapestAndExpensive(combustivelId);
    }
}
