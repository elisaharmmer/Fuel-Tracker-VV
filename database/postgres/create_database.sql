-- Criação do banco de dados
CREATE DATABASE "CombustiveisDB";


-- Criação das tabelas
CREATE TABLE "COMBUSTIVEL" (
                               "ID_Combustivel" SERIAL PRIMARY KEY,
                               "Nome" VARCHAR(100) NOT NULL UNIQUE -- Nome do combustível deve ser único
);

CREATE TABLE "POSTO" (
                         "CNPJ" VARCHAR(14) NOT NULL PRIMARY KEY, -- CNPJ deve ser único
                         "RazaoSocial" VARCHAR(255) NOT NULL,
                         "NomeFantasia" VARCHAR(255),
                         "Bandeira" VARCHAR(100),
                         "Logradouro" VARCHAR(255) NOT NULL,
                         "Numero" VARCHAR(20) NOT NULL,
                         "Bairro" VARCHAR(100) NOT NULL,
                         "Cidade" VARCHAR(100) NOT NULL,
                         "Estado" VARCHAR(50) NOT NULL,
                         "CEP" VARCHAR(10) NOT NULL,
                         CONSTRAINT CK_CNPJ_Length CHECK (LENGTH("CNPJ") = 14) -- Validação do comprimento do CNPJ
);

CREATE TABLE "PRECO_COLETADO" (
                                  "ID_Preco" SERIAL PRIMARY KEY,
                                  "Preco" DECIMAL(10, 3) NOT NULL CHECK ("Preco" >= 0), -- Validação: preço deve ser maior ou igual a 0
                                  "UnidadeMedida" VARCHAR(10) NOT NULL,
                                  "DataColeta" DATE NOT NULL,
                                  "PostoCNPJ" VARCHAR(14) NOT NULL,
                                  "CombustivelID" INT NOT NULL,
                                  FOREIGN KEY ("PostoCNPJ") REFERENCES "POSTO" ("CNPJ"),
                                  FOREIGN KEY ("CombustivelID") REFERENCES "COMBUSTIVEL" ("ID_Combustivel")
);

-- Criação dos índices
CREATE INDEX "IDX_Posto_Bairro" ON "POSTO" ("Bairro");

CREATE INDEX "IDX_PrecoColetado_CombustivelID" ON "PRECO_COLETADO" ("CombustivelID");

CREATE INDEX "IDX_PrecoColetado_DataColeta" ON "PRECO_COLETADO" ("DataColeta");

-- Criação das stored procedures (convertidas para funções no PostgreSQL)
CREATE OR REPLACE FUNCTION sp_MenorPrecoPorCombustivel(
    bairro VARCHAR(100) DEFAULT NULL,
    nomeCombustivel VARCHAR(100) DEFAULT NULL
) RETURNS TABLE(
    "NomePosto" VARCHAR,
    "Logradouro" VARCHAR,
    "Bairro" VARCHAR,
    "Combustivel" VARCHAR,
    "MenorPreco" DECIMAL,
    "DataColeta" DATE
) AS $$
BEGIN
RETURN QUERY
SELECT
    p."NomeFantasia",
    p."Logradouro",
    p."Bairro",
    c."Nome",
    MIN(pc."Preco"),
    pc."DataColeta"
FROM "POSTO" p
         JOIN "PRECO_COLETADO" pc ON p."CNPJ" = pc."PostoCNPJ"
         JOIN "COMBUSTIVEL" c ON c."ID_Combustivel" = pc."CombustivelID"
WHERE (bairro IS NULL OR p."Bairro" = bairro)
  AND (nomeCombustivel IS NULL OR c."Nome" = nomeCombustivel)
GROUP BY p."NomeFantasia", p."Logradouro", p."Bairro", c."Nome", pc."DataColeta"
ORDER BY c."Nome", pc."DataColeta";
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_PrecoMedioCombustivel(
    bairro VARCHAR(100) DEFAULT NULL,
    dataInicio DATE DEFAULT NULL,
    dataFim DATE DEFAULT NULL
) RETURNS TABLE(
    "Combustivel" VARCHAR,
    "PrecoMedio" DECIMAL,
    "Bairro" VARCHAR
) AS $$
BEGIN
RETURN QUERY
SELECT
    c."Nome",
    AVG(pc."Preco"),
    p."Bairro"
FROM "POSTO" p
         JOIN "PRECO_COLETADO" pc ON p."CNPJ" = pc."PostoCNPJ"
         JOIN "COMBUSTIVEL" c ON c."ID_Combustivel" = pc."CombustivelID"
WHERE (bairro IS NULL OR p."Bairro" = bairro)
  AND (dataInicio IS NULL OR pc."DataColeta" >= dataInicio)
  AND (dataFim IS NULL OR pc."DataColeta" <= dataFim)
GROUP BY c."Nome", p."Bairro"
ORDER BY p."Bairro", c."Nome";
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_ResumoPostosEPrecos(
    dataInicio DATE,
    dataFim DATE
) RETURNS TABLE(
    "NomePosto" VARCHAR,
    "Bairro" VARCHAR,
    "QuantidadeAmostras" INT,
    "Combustivel" VARCHAR,
    "PrecoMedio" DECIMAL
) AS $$
BEGIN
RETURN QUERY
SELECT
    p."NomeFantasia",
    p."Bairro",
    COUNT(pc."ID_Preco"),
    c."Nome",
    AVG(pc."Preco")
FROM "POSTO" p
         JOIN "PRECO_COLETADO" pc ON p."CNPJ" = pc."PostoCNPJ"
         JOIN "COMBUSTIVEL" c ON c."ID_Combustivel" = pc."CombustivelID"
WHERE pc."DataColeta" BETWEEN dataInicio AND dataFim
GROUP BY p."NomeFantasia", p."Bairro", c."Nome"
ORDER BY p."NomeFantasia", c."Nome";
END;
$$ LANGUAGE plpgsql;
