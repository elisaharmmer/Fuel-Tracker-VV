import { Controller, Get, Query } from '@nestjs/common';
import { PostoService } from '../../services/posto.service';

@Controller('postos')
export class PostoController {
  constructor(private readonly postoService: PostoService) {}

  @Get()
  getAllPostos() {
    return this.postoService.getAllPostos();
  }

  @Get('relatorio')
  getRelatorioPostos(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.postoService.getRelatorioPostos(dataInicio, dataFim);
  }
}
