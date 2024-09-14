import os
import win32com.client as win32

# Definir o caminho da pasta com as planilhas originais e onde salvar as cópias
planilhas_dir = os.path.abspath('.\\planilhas')  # Usar caminho absoluto
output_dir = os.path.abspath('.\\planilhas_copia')  # Usar caminho absoluto

# Verifica se o diretório de saída existe, se não, cria
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Inicia o Excel via COM
excel = win32.Dispatch('Excel.Application')
excel.DisplayAlerts = False  # Evita pop-ups de alerta
excel.Visible = False  # Deixe o Excel invisível enquanto trabalha

# Listar todos os arquivos na pasta 'planilhas'
planilhas = [file_name for file_name in os.listdir(planilhas_dir) if file_name.endswith('.xlsx')]

print(f"Total de planilhas a processar: {len(planilhas)}")

# Processar cada planilha
for file_name in planilhas:
    file_path = os.path.join(planilhas_dir, file_name)
    output_path = os.path.join(output_dir, file_name)

    print(f"Processando: {file_path}")

    # Abre a planilha em modo somente leitura
    workbook = excel.Workbooks.Open(file_path, ReadOnly=True)

    # Remover o atributo "Somente Leitura"
    workbook.ReadOnlyRecommended = False  # Desabilitar o modo "Somente Leitura"

    # Salva uma cópia no diretório de saída sem proteção e sem "Somente Leitura"
    workbook.SaveAs(output_path, FileFormat=51, ReadOnlyRecommended=False)  # 51 = xlOpenXMLWorkbook (formato .xlsx)

    # Fecha o workbook
    workbook.Close()

# Fecha o Excel ao terminar
excel.Quit()

print("Processo concluído. Todas as cópias foram salvas.")
