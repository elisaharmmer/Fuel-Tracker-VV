import json

# Função para formatar o CNPJ e garantir 14 dígitos
def formatar_cnpj(cnpj):
    # Remove caracteres especiais e mantém apenas os números
    cnpj_limpo = ''.join(filter(str.isdigit, cnpj))

    # Preenche com zeros à esquerda para garantir 14 dígitos
    return cnpj_limpo.zfill(14)

# Função para gerar comandos INSERT para a tabela POSTO
def insert_posto(cnpj, razao_social, nome_fantasia, bandeira, logradouro, numero, bairro, cidade, estado, cep):
    return f"INSERT INTO POSTO (CNPJ, RazaoSocial, NomeFantasia, Bandeira, Logradouro, Numero, Bairro, Cidade, Estado, CEP) " \
           f"VALUES ('{cnpj}', '{razao_social}', '{nome_fantasia}', '{bandeira}', '{logradouro}', '{numero}', '{bairro}', '{cidade}', '{estado}', '{cep}');"

# Função para gerar comandos INSERT para a tabela COMBUSTIVEL
def insert_combustivel(nome):
    return f"INSERT INTO COMBUSTIVEL (Nome) VALUES ('{nome}');"

# Função para gerar comandos INSERT para a tabela PRECO_COLETADO
def insert_preco(preco, unidade_medida, data_coleta, posto_cnpj, combustivel_id):
    return f"INSERT INTO PRECO_COLETADO (Preco, UnidadeMedida, DataColeta, PostoCNPJ, CombustivelID) " \
           f"VALUES ({preco}, '{unidade_medida}', '{data_coleta}', '{posto_cnpj}', {combustivel_id});"

# Carregar o JSON
with open('coleta_combustivel-2023-12-31-2024-05-18.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Lista para armazenar os comandos SQL
insert_statements = []

# Conjuntos para evitar duplicação de CNPJs e combustíveis
postos_inseridos = set()
combustiveis_inseridos = set()

# Iterar sobre os dados do JSON
for posto in data:
    # Formatar o CNPJ para garantir que tenha 14 dígitos
    cnpj_formatado = formatar_cnpj(posto['cnpj'])

    # Verificar se o posto já foi inserido
    if cnpj_formatado not in postos_inseridos:
        # Inserir na tabela POSTO
        endereco = posto['endereco']
        insert_statements.append(
            insert_posto(
                cnpj_formatado,
                posto['razao_social'],
                posto['nome_fantasia'],
                posto['bandeira'],
                endereco['logradouro'],
                endereco['numero'],
                endereco['bairro'],
                endereco['cidade'],
                endereco['estado'],
                endereco['cep']
            )
        )
        postos_inseridos.add(cnpj_formatado)  # Adicionar ao conjunto de CNPJs já inseridos

    # Inserir os preços coletados para cada combustível
    for combustivel, precos in posto['combustiveis'].items():
        # Verificar se o combustível já foi inserido
        if combustivel not in combustiveis_inseridos:
            # Inserir na tabela COMBUSTIVEL
            insert_statements.append(insert_combustivel(combustivel))
            combustiveis_inseridos.add(combustivel)  # Adicionar ao conjunto para evitar duplicata

        # Inserir os preços coletados na tabela PRECO_COLETADO
        for preco in precos:
            insert_statements.append(
                insert_preco(
                    preco['valor'],
                    preco['unidade_medida'],
                    preco['data_coleta'],
                    cnpj_formatado,
                    "(SELECT ID_Combustivel FROM COMBUSTIVEL WHERE Nome = '{}')".format(combustivel)
                )
            )

# Salvar os comandos em um arquivo SQL
with open('inserts_combustiveis.sql', 'w', encoding='utf-8') as f:
    for statement in insert_statements:
        f.write(statement + "\n")

print("Arquivo SQL gerado com sucesso!")
