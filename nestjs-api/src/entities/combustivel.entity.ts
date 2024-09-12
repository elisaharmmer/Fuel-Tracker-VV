import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PrecoColetado } from './preco-coletado.entity';

@Entity('COMBUSTIVEL')
export class Combustivel {
    @PrimaryGeneratedColumn({ name: 'ID_Combustivel' })
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true, name: 'Nome' })
    nome: string;

    @OneToMany(() => PrecoColetado, (precoColetado) => precoColetado.combustivel)
    precosColetados: PrecoColetado[];
}
