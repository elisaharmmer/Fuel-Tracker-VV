/*
* Script para filtrar e realizar o download das planilhas disponibilizadas no site da ANP:
* https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos/levantamento-de-precos-de-combustiveis-ultimas-semanas-pesquisadas
*
* O script é executado no console do navegador (utilizando a ferramenta de desenvolvedor do navegador),
* acessível pressionando a tecla F12 (no Chrome).
*
* Funcionalidade:
* - Este script faz o download de todas as planilhas disponíveis com o nome "Preços por posto revendedor (combustíveis automotivos e GLP P13)".
* - As planilhas são baixadas em grupos de 5, com um intervalo de 5 segundos entre cada grupo, para evitar sobrecarregar o servidor e evitar bloqueios.
* - O nome do arquivo para cada planilha será formatado no seguinte padrão:
*   "dd-mm-aaaa a dd-mm-aaaa - Atualizado em dd-mm-aaaa.xlsx"
*   Exemplo: "01-09-2024 a 07-09-2024 - Atualizado em 06-09-2024.xlsx"
*
* Ponto de atenção:
* - Certifique-se de que o seu navegador está configurado para realizar downloads automaticamente,
*   sem perguntar onde salvar o arquivo. Caso contrário, será necessário confirmar o local de download
*   manualmente para cada arquivo, o que pode ser inconveniente ao baixar muitas planilhas.
*   (No Chrome, essa configuração pode ser ajustada nas "Configurações" -> "Avançado" -> "Downloads").
*
* Instruções:
* 1. Acesse a página da ANP mencionada acima.
* 2. Abra o console do navegador pressionando F12 e vá até a aba "Console".
* 3. Cole o script abaixo no console e pressione Enter.
* 4. O script começará a baixar as planilhas em lotes de 5, exibindo o progresso no console.
* 5. O progresso será mostrado no formato "5/193, 10/193", indicando o número de downloads concluídos e o total de planilhas.
*/

// Função para esperar um tempo específico (delay)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para baixar os links enviados no array
async function downloadInBatches(links, batchSize, delay) {
    const totalLinks = links.length;

    for (let i = 0; i < totalLinks; i += batchSize) {
        const batch = links.slice(i, i + batchSize);

        batch.forEach((link, index) => {
            const url = link.getAttribute('href');
            const titleElement = link.closest('ul').previousElementSibling.querySelector('strong');
            const dateRange = titleElement ? titleElement.innerText : 'Data-desconhecida';
            const cleanDateRange = dateRange.replace(/\//g, '-');

            const updateElement = link.nextElementSibling;
            const updateText = updateElement ? updateElement.innerText.match(/\d{2}\/\d{2}\/\d{4}/) : null;
            const updateDate = updateText ? updateText[0].replace(/\//g, '-') : 'Data-desconhecida';

            const fileName = `${cleanDateRange} - Atualizado em ${updateDate}.xlsx`;

            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);

            console.log(`Baixando ${i + index + 1}/${totalLinks}: ${fileName}`);
        });

        console.log(`Batch ${i + batch.length}/${totalLinks} baixado...`);

        if (i + batchSize < totalLinks) {
            console.log(`Aguardando ${delay / 1000} segundos...`);
            await sleep(delay);
        }
    }
    console.log('Todos os downloads foram iniciados.');
}

// Busca todos as tags html de anchor (<a>)
const links = document.querySelectorAll('a');

// Filtra o que foi encontrado para exatamente a planilha que precisamos
const revendedorLinks = Array.from(links).filter(link =>
    link.textContent.includes('Preços por posto revendedor (combustíveis automotivos e GLP P13)')
);

// Chamao o código que precisa de 3 parâmetros:
// 1. O array de links;
// 2. A quantidade de downloads a serem feitos de cada vez;
// 3. O tempo para esperar para a próxima requisição;
downloadInBatches(revendedorLinks, 5, 5000);
