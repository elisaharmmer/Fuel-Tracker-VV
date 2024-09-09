import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('COMBUSTIVEL')
export class Combustivel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;
}