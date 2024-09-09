import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('POSTO')
export class Posto {
    @PrimaryColumn()
    cnpj: string;

    @Column()
    razaoSocial: string;

    @Column()
    nomeFantasia: string;

    @Column()
    bandeira: string;

    @Column()
    logradouro: string;

    @Column()
    numero: string;

    @Column()
    bairro: string;

    @Column()
    cidade: string;

    @Column()
    estado: string;

    @Column()
    cep: string;
}