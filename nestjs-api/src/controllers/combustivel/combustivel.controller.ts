import { Controller, Get } from '@nestjs/common';
import { CombustivelService } from '../../services/combustivel.service';

@Controller('combustiveis')
export class CombustivelController {
  constructor(private readonly combustivelService: CombustivelService) {}

  @Get()
  getAllCombustiveis() {
    return this.combustivelService.getAllCombustiveis();
  }
}
