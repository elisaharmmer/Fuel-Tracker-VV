import { Controller, Get, Query } from '@nestjs/common';
import {PrecoService} from "../../services/preco.service";


@Controller('precos')
export class PrecoController {
    constructor(private readonly precoService: PrecoService) {}

    @Get('menor-preco')
    async getMenorPreco(
        @Query('bairro') bairro?: string,
        @Query('combustivel') combustivel?: string,
    ) {
        return this.precoService.findMenorPrecoPorCombustivel(bairro, combustivel);
    }
}
