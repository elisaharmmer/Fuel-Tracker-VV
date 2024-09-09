import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Posto } from './posto.entity';
import { Combustivel } from './combustivel.entity';

@Entity('PRECO_COLETADO')
export class PrecoColetado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 10, scale: 3 })
    preco: number;

    @Column()
    unidadeMedida: string;

    @Column('date')
    dataColeta: Date;

    @ManyToOne(() => Posto)
    @JoinColumn({ name: 'PostoCNPJ' })
    posto: Posto;

    @ManyToOne(() => Combustivel)
    @JoinColumn({ name: 'CombustivelID' })
    combustivel: Combustivel;
}