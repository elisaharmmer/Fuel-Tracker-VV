import {Controller, Get, Param, Query} from '@nestjs/common';
import { PostoService } from '../../services/posto.service';

@Controller('postos')
export class PostoController {
  constructor(private readonly postoService: PostoService) {}

  @Get()
  getAllPostos() {
    return this.postoService.getAllPostos();
  }

  @Get(':id')
  getPosto(@Param('id') id: number) {
    return this.postoService.getOnePosto(id);
  }

  @Get('relatorio')
  getRelatorioPostos(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.postoService.getRelatorioPostos(dataInicio, dataFim);
  }
}
