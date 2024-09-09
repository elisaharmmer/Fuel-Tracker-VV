import { EntityRepository, Repository } from 'typeorm';
import { Posto } from '../entities/posto.entity';

@EntityRepository(Posto)
export class PostoRepository extends Repository<Posto> {}