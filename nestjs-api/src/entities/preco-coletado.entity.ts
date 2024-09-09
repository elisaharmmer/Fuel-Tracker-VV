import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Posto } from './posto.entity';
import { Combustivel } from './combustivel.entity';

@Entity('PRECO_COLETADO')
export class PrecoColetado {
    @PrimaryGeneratedColumn({ name: 'ID_Preco' })
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 3 })
    preco: number;

    @Column({ type: 'nvarchar', length: 10 })
    unidadeMedida: string;

    @Column({ type: 'date' })
    dataColeta: Date;

    @ManyToOne(() => Posto, (posto) => posto.precosColetados)
    posto: Posto;

    @ManyToOne(() => Combustivel, (combustivel) => combustivel.precosColetados)
    combustivel: Combustivel;
}
