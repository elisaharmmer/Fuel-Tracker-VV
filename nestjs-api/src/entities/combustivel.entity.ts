import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PrecoColetado } from './preco-coletado.entity';

@Entity('COMBUSTIVEL')
export class Combustivel {
    @PrimaryGeneratedColumn({ name: 'ID_Combustivel' })
    id: number;

    @Column({ type: 'nvarchar', length: 100, unique: true })
    nome: string;

    @OneToMany(() => PrecoColetado, (precoColetado) => precoColetado.combustivel)
    precosColetados: PrecoColetado[];
}
