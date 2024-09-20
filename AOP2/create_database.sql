USE master;
GO

-- Create the database if it doesn't exist
-- IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'FuelTrackerVV')
--     BEGIN
--         CREATE DATABASE FuelTrackerVV;
--     END;
-- GO

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'FuelTrackerVV')
    BEGIN
        DROP DATABASE FuelTrackerVV;
    END;
    CREATE DATABASE FuelTrackerVV;
GO

USE FuelTrackerVV;
GO

-- Create the COMBUSTIVEL table
CREATE TABLE [COMBUSTIVEL]
(
    [ID_Combustivel] INT IDENTITY(1,1) PRIMARY KEY,
    [Nome] VARCHAR(100) NOT NULL UNIQUE
);
GO


-- Create the POSTO table
CREATE TABLE [POSTO]
(
    [ID_Posto] INT IDENTITY(1,1) PRIMARY KEY,
    [CNPJ] VARCHAR(14) NOT NULL CHECK (LEN([CNPJ]) = 14 AND ISNUMERIC([CNPJ]) = 1),
    [RazaoSocial] VARCHAR(255) NOT NULL,
    [NomeFantasia] VARCHAR(255),
    [Bandeira] VARCHAR(100),
    [Logradouro] VARCHAR(255) NOT NULL,
    [Numero] VARCHAR(20) NOT NULL,
    [Bairro] VARCHAR(100) NOT NULL,
    [Cidade] VARCHAR(100) NOT NULL,
    [Estado] VARCHAR(50) NOT NULL,
    [CEP] VARCHAR(10) NOT NULL,
    UNIQUE ([CNPJ])
);
GO

-- Create the PRECO_COLETADO table
CREATE TABLE [PRECO_COLETADO]
(
    [ID_Preco] INT IDENTITY(1,1) PRIMARY KEY,
    [Preco] DECIMAL(10, 3) NOT NULL CHECK ([Preco] >= 0),
    [UnidadeMedida] VARCHAR(10) NOT NULL,
    [DataColeta] DATE NOT NULL,
    [CombustivelID] INT NOT NULL FOREIGN KEY REFERENCES [COMBUSTIVEL]([ID_Combustivel]),
    [PostoID] INT NOT NULL FOREIGN KEY REFERENCES [POSTO]([ID_Posto]) ON UPDATE CASCADE ON DELETE CASCADE
);
GO

-- Create indexes
CREATE INDEX IDX_Posto_Bairro ON POSTO (Bairro);
GO

CREATE INDEX idx_precocoletado_combustivelid ON PRECO_COLETADO (CombustivelID);
GO

CREATE INDEX idx_precocoletado_datacoleta ON PRECO_COLETADO (DataColeta);
GO

-- Create the stored procedures

-- Procedure to get the lowest fuel price
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
             JOIN PRECO_COLETADO pc ON p.ID_Posto = pc.PostoID
             JOIN COMBUSTIVEL c ON c.ID_Combustivel = pc.CombustivelID
    WHERE (@Bairro IS NULL OR p.Bairro = @Bairro)
      AND (@NomeCombustivel IS NULL OR c.Nome = @NomeCombustivel)
    GROUP BY p.NomeFantasia, p.Logradouro, p.Bairro, c.Nome, pc.DataColeta
    ORDER BY c.Nome, pc.DataColeta;
END;
GO

-- Procedure to get the average fuel price
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
             JOIN PRECO_COLETADO pc ON p.ID_Posto = pc.PostoID
             JOIN COMBUSTIVEL c ON c.ID_Combustivel = pc.CombustivelID
    WHERE (@Bairro IS NULL OR p.Bairro = @Bairro)
      AND (@DataInicio IS NULL OR pc.DataColeta >= @DataInicio)
      AND (@DataFim IS NULL OR pc.DataColeta <= @DataFim)
    GROUP BY c.Nome, p.Bairro
    ORDER BY p.Bairro, c.Nome;
END;
GO

-- Procedure to summarize stations and prices
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
             JOIN PRECO_COLETADO pc ON p.ID_Posto = pc.PostoID
             JOIN COMBUSTIVEL c ON c.ID_Combustivel = pc.CombustivelID
    WHERE pc.DataColeta BETWEEN @DataInicio AND @DataFim
    GROUP BY p.NomeFantasia, p.Bairro, c.Nome
    ORDER BY p.NomeFantasia, c.Nome;
END;
GO
