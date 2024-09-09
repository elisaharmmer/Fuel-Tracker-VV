import { Controller, Get } from '@nestjs/common';
import { PostoService } from '../services/posto.service';

@Controller('postos')
export class PostoController {
    constructor(private readonly postoService: PostoService) {}

    @Get()
    findAll() {
        return this.postoService.findAll();
    }
}