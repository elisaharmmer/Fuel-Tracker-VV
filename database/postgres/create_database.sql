create table "COMBUSTIVEL"
(
    "ID_Combustivel" serial
        primary key,
    "Nome"           varchar(100) not null
        unique
);

alter table "COMBUSTIVEL"
    owner to postgres;

grant select, update, usage on sequence "COMBUSTIVEL_ID_Combustivel_seq" to anon;

grant select, update, usage on sequence "COMBUSTIVEL_ID_Combustivel_seq" to authenticated;

grant select, update, usage on sequence "COMBUSTIVEL_ID_Combustivel_seq" to service_role;

grant delete, insert, references, select, trigger, truncate, update on "COMBUSTIVEL" to anon;

grant delete, insert, references, select, trigger, truncate, update on "COMBUSTIVEL" to authenticated;

grant delete, insert, references, select, trigger, truncate, update on "COMBUSTIVEL" to service_role;

create table "POSTO"
(
    "ID_Posto"     serial
        constraint "POSTO_pkey1"
            primary key,
    "CNPJ"         varchar(14) not null
        constraint cnpj_length_check
            check ((length(("CNPJ")::text) = 14) AND (("CNPJ")::text ~ '^[0-9]+$'::text)),
    "RazaoSocial"  varchar(255) not null,
    "NomeFantasia" varchar(255),
    "Bandeira"     varchar(100),
    "Logradouro"   varchar(255) not null,
    "Numero"       varchar(20) not null,
    "Bairro"       varchar(100) not null,
    "Cidade"       varchar(100) not null,
    "Estado"       varchar(50) not null,
    "CEP"          varchar(10) not null,
    UNIQUE ("CNPJ")
);


alter table "POSTO"
    owner to postgres;

grant select, update, usage on sequence "POSTO_ID_Posto_seq" to anon;

grant select, update, usage on sequence "POSTO_ID_Posto_seq" to authenticated;

grant select, update, usage on sequence "POSTO_ID_Posto_seq" to service_role;

create table "PRECO_COLETADO"
(
    "ID_Preco"      serial
        primary key,
    "Preco"         numeric(10, 3) not null
        constraint "PRECO_COLETADO_Preco_check"
            check ("Preco" >= (0)::numeric),
    "UnidadeMedida" varchar(10)    not null,
    "DataColeta"    date           not null,
    "CombustivelID" integer        not null
        references "COMBUSTIVEL",
    "PostoID"       integer        not null
        constraint "FK_PostoID"
            references "POSTO"
            on update cascade on delete cascade
);

alter table "PRECO_COLETADO"
    owner to postgres;

grant select, update, usage on sequence "PRECO_COLETADO_ID_Preco_seq" to anon;

grant select, update, usage on sequence "PRECO_COLETADO_ID_Preco_seq" to authenticated;

grant select, update, usage on sequence "PRECO_COLETADO_ID_Preco_seq" to service_role;

create index idx_precocoletado_combustivelid
    on "PRECO_COLETADO" ("CombustivelID");

create index idx_precocoletado_datacoleta
    on "PRECO_COLETADO" ("DataColeta");

grant delete, insert, references, select, trigger, truncate, update on "PRECO_COLETADO" to anon;

grant delete, insert, references, select, trigger, truncate, update on "PRECO_COLETADO" to authenticated;

grant delete, insert, references, select, trigger, truncate, update on "PRECO_COLETADO" to service_role;

grant delete, insert, references, select, trigger, truncate, update on "POSTO" to anon;

grant delete, insert, references, select, trigger, truncate, update on "POSTO" to authenticated;

grant delete, insert, references, select, trigger, truncate, update on "POSTO" to service_role;

create function get_menor_preco_combustivel(bairro_param character varying DEFAULT NULL::character varying, combustivel_param character varying DEFAULT NULL::character varying)
    returns TABLE(nome_posto character varying, logradouro character varying, bairro character varying, nome_combustivel character varying, menor_preco numeric, data_coleta date)
    language plpgsql
as
$$
BEGIN
RETURN QUERY
SELECT
    po."NomeFantasia" AS nome_posto,
    po."Logradouro" AS logradouro,
    po."Bairro" AS bairro,
    co."Nome" AS nome_combustivel,
    MIN(pc."Preco") AS menor_preco,
    pc."DataColeta" AS data_coleta
FROM public."POSTO" po
         JOIN public."PRECO_COLETADO" pc ON po."ID_Posto" = pc."PostoID"
         JOIN public."COMBUSTIVEL" co ON pc."CombustivelID" = co."ID_Combustivel"
WHERE (bairro_param IS NULL OR po."Bairro" = bairro_param)
  AND (combustivel_param IS NULL OR co."Nome" = combustivel_param)
GROUP BY po."NomeFantasia", po."Logradouro", po."Bairro", co."Nome", pc."DataColeta";
END;
$$;

alter function get_menor_preco_combustivel(varchar, varchar) owner to postgres;

grant execute on function get_menor_preco_combustivel(varchar, varchar) to anon;

grant execute on function get_menor_preco_combustivel(varchar, varchar) to authenticated;

grant execute on function get_menor_preco_combustivel(varchar, varchar) to service_role;

create function get_preco_medio_geral(bairro_param character varying DEFAULT NULL::character varying, data_inicio date DEFAULT NULL::date, data_fim date DEFAULT NULL::date)
    returns TABLE(nome_combustivel character varying, preco_medio numeric)
    language plpgsql
as
$$
BEGIN
RETURN QUERY
SELECT
    co."Nome" AS nome_combustivel,
    AVG(pc."Preco") AS preco_medio
FROM public."PRECO_COLETADO" pc
         JOIN public."COMBUSTIVEL" co ON pc."CombustivelID" = co."ID_Combustivel"
         JOIN public."POSTO" po ON pc."PostoID" = po."ID_Posto"
WHERE (bairro_param IS NULL OR po."Bairro" = bairro_param)
  AND (data_inicio IS NULL OR pc."DataColeta" >= data_inicio)
  AND (data_fim IS NULL OR pc."DataColeta" <= data_fim)
GROUP BY co."Nome";
END;
$$;

alter function get_preco_medio_geral(varchar, date, date) owner to postgres;

grant execute on function get_preco_medio_geral(varchar, date, date) to anon;

grant execute on function get_preco_medio_geral(varchar, date, date) to authenticated;

grant execute on function get_preco_medio_geral(varchar, date, date) to service_role;

create function get_relatorio_postos(data_inicio date, data_fim date)
    returns TABLE(nome_posto character varying, bairro character varying, qtd_amostras integer, nome_combustivel character varying, preco_medio numeric)
    language plpgsql
as
$$
BEGIN
RETURN QUERY
SELECT
    po."NomeFantasia" AS nome_posto,
    po."Bairro" AS bairro,
    COUNT(pc."ID_Preco") AS qtd_amostras,
    co."Nome" AS nome_combustivel,
    AVG(pc."Preco") AS preco_medio
FROM public."POSTO" po
         JOIN public."PRECO_COLETADO" pc ON po."ID_Posto" = pc."PostoID"
         JOIN public."COMBUSTIVEL" co ON pc."CombustivelID" = co."ID_Combustivel"
WHERE pc."DataColeta" BETWEEN data_inicio AND data_fim
GROUP BY po."NomeFantasia", po."Bairro", co."Nome";
END;
$$;

alter function get_relatorio_postos(date, date) owner to postgres;

grant execute on function get_relatorio_postos(date, date) to anon;

grant execute on function get_relatorio_postos(date, date) to authenticated;

grant execute on function get_relatorio_postos(date, date) to service_role;

