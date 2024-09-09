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

    async findAll(): Promise<Posto[]> {
        return this.postoRepository.find();
    }
}
