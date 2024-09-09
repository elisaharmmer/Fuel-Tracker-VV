import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posto } from '../entities/posto.entity';

@Injectable()
export class PostoService {
    constructor(
        @InjectRepository(Posto)
        private readonly postoRepository: Repository<Posto>,
    ) {}

    getAllPostos(): Promise<Posto[]> {
        return this.postoRepository.find();
    }

    getRelatorioPostos(dataInicio: string, dataFim: string): Promise<any[]> {
        return this.postoRepository.query(
            `EXEC sp_ResumoPostosEPrecos @DataInicio = '${dataInicio}', @DataFim = '${dataFim}'`,
        );
    }
}
