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
    return this.precoService.getMenorPrecoCombustivel(bairro, combustivel);
  }

  @Get('media-preco')
  async getMediaPreco(
    @Query('bairro') bairro?: string,
    @Query('combustivel') combustivel?: string,
  ) {
    return this.precoService.getMediaPrecoCombustivel(bairro, combustivel);
  }

  @Get('maior-preco')
  async getMaiorPreco(
    @Query('bairro') bairro?: string,
    @Query('combustivel') combustivel?: string,
  ) {
    return this.precoService.getMaiorPrecoCombustivel(bairro, combustivel);
  }

  @Get('media-bairro')
  async getMediaBairro(@Query('bairro') bairro: string, @Query('combustivel') combustivel: string) {
    return this.precoService.getMediaBairro(bairro, combustivel);
  }

  @Get('media-combustivel')
  async getMediaCombustivel(@Query('mes') mes?: string, @Query('ano') ano?: string) {
    return this.precoService.getMediaCombustivel(mes, ano);
  }

  @Get('media-mensal')
  async getMediaMensal() {
    return this.precoService.getMediaMensal();
  }
}
