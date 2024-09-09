import { Controller, Get, Query } from '@nestjs/common';
import { PrecoService } from '../services/preco.service';

@Controller('precos')
export class PrecoController {
    constructor(private readonly precoService: PrecoService) {}

    @Get('menor')
    getMenorPreco(
        @Query('bairro') bairro?: string,
        @Query('combustivel') combustivel?: string,
    ) {
        return this.precoService.getMenorPreco(bairro, combustivel);
    }

    @Get('media')
    getMediaPreco(
        @Query('bairro') bairro?: string,
        @Query('dataInicio') dataInicio?: string,
        @Query('dataFim') dataFim?: string,
    ) {
        return this.precoService.getMediaPreco(bairro, dataInicio, dataFim);
    }
}
