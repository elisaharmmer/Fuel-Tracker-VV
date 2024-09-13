import { Controller, Get, Query } from '@nestjs/common';
import { PrecoService } from '../../services/preco.service';

@Controller('precos')
export class PrecoController {
  constructor(private readonly precoService: PrecoService) {}

  @Get()
  async getPrecos(
    @Query('page') page?: number, // Paginação
    @Query('limit') limit?: number, // Limite de resultados
  ) {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 50;

    return this.precoService.getAll(pageNumber, limitNumber);
  }

  @Get('menor-preco')
  async getMenorPreco(
    @Query('bairro') bairro?: string,
    @Query('combustivel') combustivel?: string,
  ) {
    return this.precoService.findMenorPrecoPorCombustivel(bairro, combustivel);
  }
}
