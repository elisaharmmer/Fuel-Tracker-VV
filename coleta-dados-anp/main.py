import os
import pandas as pd
from decimal import Decimal, ROUND_HALF_UP

# Definir o caminho da pasta com as planilhas recriadas
planilhas_dir = '.\\planilhas'

# Definir os combustíveis permitidos (exceto Diesel, que será tratado separadamente)
combustiveis_permitidos = ['GASOLINA COMUM', 'GASOLINA ADITIVADA', 'ETANOL']

# Função para formatar os valores com 3 casas decimais
def formatar_preco(valor):
    return Decimal(valor).quantize(Decimal('0.000'), rounding=ROUND_HALF_UP)

# Criar uma lista para armazenar os dados de cada posto como objetos
postos_array = []

# Função para processar cada planilha e inserir os dados na lista
def processar_planilha(file_path):
    # Carregar a planilha diretamente com pandas
    data = pd.read_excel(file_path, sheet_name='POSTOS REVENDEDORES', skiprows=9, dtype={'CNPJ': str, 'CEP': str}, engine='openpyxl')

    # Filtrar para o município de Vila Velha no estado de Espírito Santo
    filtered_data = data[(data['MUNICÍPIO'] == 'VILA VELHA') & (data['ESTADO'] == 'ESPIRITO SANTO')]

    # Iterar pelos dados filtrados
    for _, row in filtered_data.iterrows():
        tipo_combustivel = row['PRODUTO']

        # Considerar os combustíveis permitidos e os dois tipos de Diesel
        if tipo_combustivel in combustiveis_permitidos or tipo_combustivel in ['DIESEL S500', 'DIESEL S10']:
            cnpj = row['CNPJ']

            # Converter a data para o formato 'YYYY-MM-DD' sem o horário
            data_coleta_str = row['DATA DA COLETA'].strftime('%Y-%m-%d') if pd.notna(row['DATA DA COLETA']) else "N/A"
            complemento = str(row['COMPLEMENTO']) if pd.notna(row['COMPLEMENTO']) else "N/A"

            # Converter o preço de revenda para Decimal e formatar com 3 casas decimais
            preco_revenda = formatar_preco(row['PREÇO DE REVENDA'])

            # Verificar se o posto já está na lista (pelo CNPJ)
            posto_existente = next((posto for posto in postos_array if posto['cnpj'] == cnpj), None)

            if not posto_existente:
                # Se o posto não existe na lista, adicionar um novo objeto
                posto_existente = {
                    'cnpj': cnpj,
                    'razao_social': row['RAZÃO'],
                    'nome_fantasia': str(row['FANTASIA']) if pd.notna(row['FANTASIA']) else row['RAZÃO'],
                    'bandeira': row['BANDEIRA'],
                    'endereco': {
                        'cep': row['CEP'],
                        'logradouro': row['ENDEREÇO'],
                        'numero': row['NÚMERO'],
                        'bairro': row['BAIRRO'],
                        'cidade': row['MUNICÍPIO'],
                        'estado': row['ESTADO'],
                    },
                    'combustiveis': {}
                }
                postos_array.append(posto_existente)

            # Se o combustível já existe, vamos adicionar a data como uma lista de entradas
            if tipo_combustivel in posto_existente['combustiveis']:
                posto_existente['combustiveis'][tipo_combustivel].append({
                    'valor': str(preco_revenda),  # Converter Decimal para string para serialização JSON
                    'unidade_medida': row['UNIDADE DE MEDIDA'],
                    'data_coleta': data_coleta_str
                })
            else:
                # Caso contrário, criamos a primeira entrada para esse combustível
                posto_existente['combustiveis'][tipo_combustivel] = [{
                    'valor': str(preco_revenda),  # Converter Decimal para string para serialização JSON
                    'unidade_medida': row['UNIDADE DE MEDIDA'],
                    'data_coleta': data_coleta_str
                }]

# Listar todos os arquivos na pasta 'planilhas_copia' e contar o total
planilhas = [file_name for file_name in os.listdir(planilhas_dir) if file_name.endswith('.xlsx')]
total_planilhas = len(planilhas)
# Processar todas as planilhas com contagem
for index, file_name in enumerate(planilhas, start=1):
    file_path = os.path.join(planilhas_dir, file_name)
    print(f"Processando planilha {index} de {total_planilhas}: {file_name}")
    processar_planilha(file_path)


# Agora, remover postos que não possuem todos os combustíveis principais, e verificar os tipos de diesel
postos_filtrados = []
for posto in postos_array:
    combustiveis = posto['combustiveis']

    # Verificar se o posto tem os combustíveis principais (Gasolina Comum, Gasolina Aditivada, Etanol)
    tem_combustiveis_principais = all(combustivel in combustiveis for combustivel in combustiveis_permitidos)

    # Verificar se o posto tem pelo menos um tipo de Diesel (S500 ou S10)
    tem_diesel = 'DIESEL S500' in combustiveis or 'DIESEL S10' in combustiveis

    # Se o posto tiver os combustíveis principais e pelo menos um tipo de diesel, incluímos no resultado
    if tem_combustiveis_principais and tem_diesel:
        # Ordenar as coletas por data
        for combustivel in combustiveis:
            combustiveis[combustivel] = sorted(
                combustiveis[combustivel],
                key=lambda x: x['data_coleta']
            )
        postos_filtrados.append(posto)

# Exibir o array final em JSON
import json
print(json.dumps(postos_filtrados, indent=4, ensure_ascii=False))

# Exportar para um arquivo JSON
with open('coleta_combustivel-2023-12-31-2024-05-18.json', 'w', encoding='utf-8') as json_file:
    json.dump(postos_filtrados, json_file, ensure_ascii=False, indent=4)

print('JSON salvo com sucesso!')
