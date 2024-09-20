
CREATE TABLE POSTO (
    ID_Posto INT IDENTITY(1,1) PRIMARY KEY,
    CNPJ VARCHAR(20) NOT NULL,
    Razao_Social VARCHAR(255) NOT NULL,
    Nome_Fantasia VARCHAR(255) NOT NULL,
    Bandeira VARCHAR(255),
    Logradouro VARCHAR(255) NOT NULL,
    Numero VARCHAR(20) NOT NULL,
    Bairro VARCHAR(100) NOT NULL,
    Cidade VARCHAR(100) NOT NULL,
    Estado VARCHAR(2) NOT NULL,
    CEP VARCHAR(9) NOT NULL,
    CONSTRAINT CK_CNPJ CHECK (LEN(CNPJ) = 14 AND CNPJ NOT LIKE '%[^0-9]%') -- Validação do CNPJ com 14 caracteres numéricos
);

CREATE TABLE COMBUSTIVEL (
    ID_Combustivel INT IDENTITY(1,1) PRIMARY KEY,
    Tipo_Combustivel VARCHAR(50) NOT NULL
);

CREATE TABLE PRECO_COLETADO (
    ID_Preco INT IDENTITY(1,1) PRIMARY KEY,
    Preco DECIMAL(10, 3) NOT NULL,
    UnidadeMedida VARCHAR(10) NOT NULL,
    DataColeta DATE NOT NULL,
    CombustivelID INT NOT NULL,
    PostoID INT NOT NULL,
    CONSTRAINT CK_Preco CHECK (Preco > 0), -- Validação para garantir que o preço seja maior que 0
    FOREIGN KEY (CombustivelID) REFERENCES COMBUSTIVEL(ID_Combustivel),
    FOREIGN KEY (PostoID) REFERENCES POSTO(ID_Posto)
);
