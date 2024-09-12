import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { PrecoColetado } from './preco-coletado.entity';

@Entity('POSTO')
export class Posto {
    @PrimaryColumn({ type: 'varchar', length: 14, name: 'CNPJ' })
    cnpj: string;

    @Column({ type: 'varchar', length: 255, name: 'RazaoSocial' })
    razaoSocial: string;

    @Column({ type: 'varchar', length: 255, name: 'NomeFantasia' })
    nomeFantasia: string;

    @Column({ type: 'varchar', length: 100, name: 'Bandeira' })
    bandeira: string;

    @Column({ type: 'varchar', length: 255, name: 'Logradouro' })
    logradouro: string;

    @Column({ type: 'varchar', length: 20, name: 'Numero' })
    numero: string;

    @Column({ type: 'varchar', length: 100, name: 'Bairro' })
    bairro: string;

    @Column({ type: 'varchar', length: 100, name: 'Cidade' })
    cidade: string;

    @Column({ type: 'varchar', length: 50, name: 'Estado' })
    estado: string;

    @Column({ type: 'varchar', length: 10, name: 'CEP' })
    cep: string;

    @OneToMany(() => PrecoColetado, (precoColetado) => precoColetado.posto)
    precosColetados: PrecoColetado[];
}
