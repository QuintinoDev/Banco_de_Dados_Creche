// Divide o caminho da URL em partes e pega a terceira parte do caminho
const pathParts = window.location.pathname.split('/');
const dynamicPath = pathParts[2];

// Adiciona um evento para quando o conteúdo do documento estiver totalmente carregado
document.addEventListener("DOMContentLoaded", async () => {
    // Se a rota dinâmica for 'pedagoga', busca os números das salas
    if (dynamicPath == 'pedagoga') {
        async function fetchSalaNumbers() {
            const response = await fetch('http://localhost:3000/salas');
            const salas = await response.json();
            const selectElement = document.getElementById('numero_sala');

            // Adiciona cada número de sala como uma opção no dropdown
            salas.forEach(sala => {
                const option = document.createElement('option');
                option.value = sala.numero_sala;
                option.textContent = sala.numero_sala;
                selectElement.appendChild(option);
            });
        }
        await fetchSalaNumbers(); // Chama a função para buscar os números das salas
    }

    // Configura o manipulador de envio do formulário
    function setupFormSubmitHandler(tableName) {
        document.getElementById("form").addEventListener("submit", async (event) => {
            event.preventDefault(); // Previne o comportamento padrão de submissão do formulário

            const formData = new FormData(event.target); // Coleta os dados do formulário
            const formObject = {};
            formData.forEach((value, key) => {
                if (key === 'cep') {
                    // Remove caracteres não numéricos do campo 'cep'
                    formObject[key.replace(/\s/g, '_')] = value.replace(/\D/g, '');
                } else {
                    // Substitui espaços por underscores nos nomes dos campos
                    formObject[key.replace(/\s/g, '_')] = value;
                }
            });

            // Formata os campos de data para o formato YYYY-MM-DD
            const formattedDateFields = ['data_inicio', 'data_fim', 'data_nascimento'];
            formattedDateFields.forEach(field => {
                if (formObject[field]) {
                    const parts = formObject[field].split('/');
                    formObject[field] = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            });

            // Define a URL e o método da requisição
            const url = `http://localhost:3000/${tableName}`;
            const method = 'POST';

            // Envia os dados do formulário para o servidor
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObject) // Converte os dados para JSON
            });

            // Verifica se a requisição foi bem-sucedida e redireciona ou mostra um alerta de erro
            if (response.ok) {
                alert("Cadastro feito com sucesso.");
                window.location.href = `http://127.0.0.1:5500/src/${dynamicPath}/list/index.html`;
            } else {
                alert("Erro ao cadastrar.");
            }
        });
    }

    // Configura o manipulador de envio do formulário com base na rota dinâmica
    setupFormSubmitHandler(`${dynamicPath}`);
});

// Função para formatar a data no formato DD/MM/YYYY
function formatarData(input) {
    let valor = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    if (valor.length > 2) {
        valor = valor.substring(0, 2) + '/' + valor.substring(2);
    }
    if (valor.length > 5) {
        valor = valor.substring(0, 5) + '/' + valor.substring(5, 9);
    }

    input.value = valor; // Atualiza o valor do input com a data formatada
}

// Função para formatar o CEP no formato XXXXX-XXX
function formatarCep(input) {
    let valor = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    if (valor.length > 5) {
        valor = valor.substring(0, 5) + '-' + valor.substring(5, 8);
    }

    input.value = valor; // Atualiza o valor do input com o CEP formatado
}

// Função para formatar o CPF no formato XXX.XXX.XXX-XX
function formatarCpf(input) {
    let valor = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    valor = valor.slice(0, 11); // Limita o número de caracteres a 11

    if (valor.length > 9) {
        valor = valor.substring(0, 9) + '-' + valor.substring(9);
    }

    if (valor.length > 6) {
        valor = valor.substring(0, 6) + '.' + valor.substring(6);
    }

    if (valor.length > 3) {
        valor = valor.substring(0, 3) + '.' + valor.substring(3);
    }

    input.value = valor; // Atualiza o valor do input com o CPF formatado
}
