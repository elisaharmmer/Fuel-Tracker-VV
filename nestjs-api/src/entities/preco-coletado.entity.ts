import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Posto } from './posto.entity';
import { Combustivel } from './combustivel.entity';

@Entity('PRECO_COLETADO')
export class PrecoColetado {
    @PrimaryGeneratedColumn({ name: 'ID_Preco' })
    id: number;

    @Column({ type: 'numeric', precision: 10, scale: 3, name: 'Preco' })
    preco: number;

    @Column({ type: 'varchar', length: 10, name: 'UnidadeMedida' })
    unidadeMedida: string;

    @Column({ type: 'date', name: 'DataColeta' })
    dataColeta: Date;

    @ManyToOne(() => Posto, (posto) => posto.precosColetados)
    @JoinColumn({ name: 'PostoCNPJ' })
    posto: Posto;

    @ManyToOne(() => Combustivel, (combustivel) => combustivel.precosColetados)
    @JoinColumn({ name: 'CombustivelID' })
    combustivel: Combustivel;
}
