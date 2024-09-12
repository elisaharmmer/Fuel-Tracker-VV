-- Criação do banco de dados apenas se ele não existir
CREATE DATABASE IF NOT EXISTS CombustiveisDB;

USE CombustiveisDB;

-- Criação das tabelas
CREATE TABLE COMBUSTIVEL (
                             ID_Combustivel INT AUTO_INCREMENT PRIMARY KEY,
                             Nome VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE POSTO (
                       CNPJ VARCHAR(14) NOT NULL PRIMARY KEY,
                       RazaoSocial VARCHAR(255) NOT NULL,
                       NomeFantasia VARCHAR(255),
                       Bandeira VARCHAR(100),
                       Logradouro VARCHAR(255) NOT NULL,
                       Numero VARCHAR(20) NOT NULL,
                       Bairro VARCHAR(100) NOT NULL,
                       Cidade VARCHAR(100) NOT NULL,
                       Estado VARCHAR(50) NOT NULL,
                       CEP VARCHAR(10) NOT NULL
);

CREATE TABLE PRECO_COLETADO (
                                ID_Preco INT AUTO_INCREMENT PRIMARY KEY,
                                Preco DECIMAL(10, 3) NOT NULL,
                                UnidadeMedida VARCHAR(10) NOT NULL,
                                DataColeta DATE NOT NULL,
                                PostoCNPJ VARCHAR(14) NOT NULL,
                                CombustivelID INT NOT NULL,
                                FOREIGN KEY (PostoCNPJ) REFERENCES POSTO(CNPJ),
                                FOREIGN KEY (CombustivelID) REFERENCES COMBUSTIVEL(ID_Combustivel)
);

-- Criação dos índices
CREATE INDEX IDX_Posto_Bairro ON POSTO (Bairro);
CREATE INDEX IDX_PrecoColetado_CombustivelID ON PRECO_COLETADO (CombustivelID);
CREATE INDEX IDX_PrecoColetado_DataColeta ON PRECO_COLETADO (DataColeta);

-- Criação das stored procedures
DELIMITER $$

CREATE PROCEDURE sp_MenorPrecoPorCombustivel (
    IN Bairro VARCHAR(100),
    IN NomeCombustivel VARCHAR(100)
)
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
    WHERE (Bairro IS NULL OR p.Bairro = Bairro)
      AND (NomeCombustivel IS NULL OR c.Nome = NomeCombustivel)
    GROUP BY p.NomeFantasia, p.Logradouro, p.Bairro, c.Nome, pc.DataColeta
    ORDER BY c.Nome, pc.DataColeta;
END$$

DELIMITER ;

-- Criação do usuário específico para a API NestJS
CREATE USER 'api_user'@'%' IDENTIFIED BY 'SenhaSegura123!';

-- Conceder permissões ao usuário
GRANT ALL PRIVILEGES ON CombustiveisDB.* TO 'api_user'@'%';
