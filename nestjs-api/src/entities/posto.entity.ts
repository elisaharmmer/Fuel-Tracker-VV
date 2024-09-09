import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { PrecoColetado } from './preco-coletado.entity';

@Entity('POSTO')
export class Posto {
    @PrimaryColumn({ type: 'varchar', length: 14 })
    cnpj: string;

    @Column({ type: 'nvarchar', length: 255 })
    razaoSocial: string;

    @Column({ type: 'nvarchar', length: 255, nullable: true })
    nomeFantasia: string;

    @Column({ type: 'nvarchar', length: 100, nullable: true })
    bandeira: string;

    @Column({ type: 'nvarchar', length: 255 })
    logradouro: string;

    @Column({ type: 'nvarchar', length: 20 })
    numero: string;

    @Column({ type: 'nvarchar', length: 100 })
    bairro: string;

    @Column({ type: 'nvarchar', length: 100 })
    cidade: string;

    @Column({ type: 'nvarchar', length: 50 })
    estado: string;

    @Column({ type: 'nvarchar', length: 10 })
    cep: string;

    @OneToMany(() => PrecoColetado, (precoColetado) => precoColetado.posto)
    precosColetados: PrecoColetado[];
}
