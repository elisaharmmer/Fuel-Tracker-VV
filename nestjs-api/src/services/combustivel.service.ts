import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Combustivel } from '../entities/combustivel.entity';

@Injectable()
export class CombustivelService {
  constructor(
    @InjectRepository(Combustivel)
    private readonly combustivelRepository: Repository<Combustivel>,
  ) {}

  getAllCombustiveis(): Promise<Combustivel[]> {
    return this.combustivelRepository.find();
  }
}
