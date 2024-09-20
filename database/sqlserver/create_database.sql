-- Criação do banco de dados
CREATE DATABASE CombustiveisDB;
GO

USE CombustiveisDB;
GO

-- Criação das tabelas
CREATE TABLE COMBUSTIVEL (
                             ID_Combustivel INT IDENTITY(1,1) PRIMARY KEY,
                             Nome NVARCHAR(100) NOT NULL UNIQUE -- Nome do combustível deve ser único
);
GO

CREATE TABLE POSTO (
                       CNPJ VARCHAR(14) NOT NULL PRIMARY KEY, -- CNPJ deve ser único (PK já garante isso)
                       RazaoSocial NVARCHAR(255) NOT NULL,
                       NomeFantasia NVARCHAR(255),
                       Bandeira NVARCHAR(100),
                       Logradouro NVARCHAR(255) NOT NULL,
                       Numero NVARCHAR(20) NOT NULL,
                       Bairro NVARCHAR(100) NOT NULL,
                       Cidade NVARCHAR(100) NOT NULL,
                       Estado NVARCHAR(50) NOT NULL,
                       CEP NVARCHAR(10) NOT NULL,
                       CONSTRAINT CK_CNPJ_Length CHECK (LEN(CNPJ) = 14) -- Validação do comprimento do CNPJ
);
GO

CREATE TABLE PRECO_COLETADO (
                                ID_Preco INT IDENTITY(1,1) PRIMARY KEY,
                                Preco DECIMAL(10, 3) NOT NULL CHECK (Preco >= 0), -- Validação: preço deve ser maior ou igual a 0
                                UnidadeMedida NVARCHAR(10) NOT NULL,
                                DataColeta DATE NOT NULL,
                                PostoCNPJ VARCHAR(14) NOT NULL,
                                CombustivelID INT NOT NULL,
                                FOREIGN KEY (PostoCNPJ) REFERENCES POSTO(CNPJ),
                                FOREIGN KEY (CombustivelID) REFERENCES COMBUSTIVEL(ID_Combustivel)
);
GO

-- Criação dos índices
CREATE INDEX IDX_Posto_Bairro ON POSTO (Bairro);
GO

CREATE INDEX IDX_PrecoColetado_CombustivelID ON PRECO_COLETADO (CombustivelID);
GO

CREATE INDEX IDX_PrecoColetado_DataColeta ON PRECO_COLETADO (DataColeta);
GO

-- Criação das stored procedures
CREATE PROCEDURE sp_MenorPrecoPorCombustivel
    @Bairro NVARCHAR(100) = NULL,
    @NomeCombustivel NVARCHAR(100) = NULL
AS
BEGIN
    SELECT
        p.NomeFantasia AS NomePosto,
        p.Logradouro,
        p.Bairro,
        c.Nome AS Combustivel,
        MIN(pc.Preco) AS MenorPreco,
        pc.DataColeta
    FROM POSTO p
             JOIN PRECO_COLETADO pc ON p.CNPJ = pc.PostoCNPJ
             JOIN COMBUSTIVEL c ON c.ID_Combustivel = pc.CombustivelID
    WHERE (@Bairro IS NULL OR p.Bairro = @Bairro)
      AND (@NomeCombustivel IS NULL OR c.Nome = @NomeCombustivel)
    GROUP BY p.NomeFantasia, p.Logradouro, p.Bairro, c.Nome, pc.DataColeta
    ORDER BY c.Nome, pc.DataColeta;
END;
GO

CREATE PROCEDURE sp_PrecoMedioCombustivel
    @Bairro NVARCHAR(100) = NULL,
    @DataInicio DATE = NULL,
    @DataFim DATE = NULL
AS
BEGIN
    SELECT
        c.Nome AS Combustivel,
        AVG(pc.Preco) AS PrecoMedio,
        p.Bairro
    FROM POSTO p
             JOIN PRECO_COLETADO pc ON p.CNPJ = pc.PostoCNPJ
             JOIN COMBUSTIVEL c ON c.ID_Combustivel = pc.CombustivelID
    WHERE (@Bairro IS NULL OR p.Bairro = @Bairro)
      AND (@DataInicio IS NULL OR pc.DataColeta >= @DataInicio)
      AND (@DataFim IS NULL OR pc.DataColeta <= @DataFim)
    GROUP BY c.Nome, p.Bairro
    ORDER BY p.Bairro, c.Nome;
END;
GO

CREATE PROCEDURE sp_ResumoPostosEPrecos
    @DataInicio DATE,
    @DataFim DATE
AS
BEGIN
    SELECT
        p.NomeFantasia AS NomePosto,
        p.Bairro,
        COUNT(pc.ID_Preco) AS QuantidadeAmostras,
        c.Nome AS Combustivel,
        AVG(pc.Preco) AS PrecoMedio
    FROM POSTO p
             JOIN PRECO_COLETADO pc ON p.CNPJ = pc.PostoCNPJ
             JOIN COMBUSTIVEL c ON c.ID_Combustivel = pc.CombustivelID
    WHERE pc.DataColeta BETWEEN @DataInicio AND @DataFim
    GROUP BY p.NomeFantasia, p.Bairro, c.Nome
    ORDER BY p.NomeFantasia, c.Nome;
END;
GO
