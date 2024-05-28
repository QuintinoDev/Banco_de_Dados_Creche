// Obtém os parâmetros da URL
const urlParams = new URLSearchParams(window.location.search);

// Divide o caminho da URL em partes e pega a terceira parte do caminho
const pathParts = window.location.pathname.split('/');
const dynamicPath = pathParts[2];

// Obtém o valor do parâmetro 'id' da URL
const id = urlParams.get('id');

// Adiciona um evento para quando o conteúdo do documento estiver totalmente carregado
document.addEventListener('DOMContentLoaded', function () {

    // Faz uma requisição para buscar dados específicos baseados na rota dinâmica e no ID
    fetch(`http://localhost:3000/${dynamicPath}/${id}`)
        .then(response => response.json()) // Converte a resposta em JSON
        .then(data => {
            if (data) { // Verifica se os dados foram encontrados
                if (dynamicPath === 'crianca') {
                    // Preenche os campos do formulário com os dados da criança
                    document.getElementById('nome').value = data.nome;
                    document.getElementById('sobrenome').value = data.sobrenome;

                    // Formata a data de nascimento para o formato pt-BR e preenche o campo correspondente
                    const dataNascimento = new Date(data.data_nascimento).toLocaleDateString('pt-BR');
                    document.getElementById('data_nascimento').value = dataNascimento;

                    document.getElementById('id_sexo').value = data.id_sexo;
                    document.getElementById('quadra').value = data.quadra;
                    document.getElementById('numero').value = data.numero;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.cidade;
                    document.getElementById('estado').value = data.estado;
                    document.getElementById('cep').value = data.cep;
                }

                if (dynamicPath === 'pedagoga') {
                    // Preenche os campos do formulário com os dados da pedagoga
                    document.getElementById('nome').value = data.Nome;
                    document.getElementById('sobrenome').value = data.Sobrenome;
                    document.getElementById('cpf').value = data.CPF;
                    document.getElementById('numero_sala').value = data.Numero_sala;
                    document.getElementById('id_sexo').value = data.ID_Sexo;
                }
            } else {
                console.log('Dados não encontrados');
            }
        })
        .catch(error => console.error('Erro ao buscar dados:', error));

    // Faz uma requisição para buscar os números das salas
    fetch('http://localhost:3000/salas')
        .then(response => response.json())
        .then(salas => {
            const numeroSalaSelect = document.getElementById('numero_sala');
            // Preenche o dropdown com os números das salas
            salas.forEach(sala => {
                const option = document.createElement('option');
                option.value = sala.numero_sala;
                option.textContent = sala.numero_sala;
                numeroSalaSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao buscar números das salas:', error));

    // Adiciona um evento para o formulário de submissão
    document.getElementById('form').addEventListener('submit', function (event) {
        event.preventDefault(); // Previne o comportamento padrão de submissão do formulário

        let data; // Declara a variável para armazenar os dados a serem enviados

        // Verifica se a rota dinâmica é 'crianca' ou 'pedagoga' e coleta os dados correspondentes
        if (dynamicPath == 'crianca') {
            const nome = document.getElementById('nome').value;
            const sobrenome = document.getElementById('sobrenome').value;
            const dataNascimento = document.getElementById('data_nascimento').value;
            const idSexo = document.getElementById('id_sexo').value;
            const quadra = document.getElementById('quadra').value;
            const numero = document.getElementById('numero').value;
            const bairro = document.getElementById('bairro').value;
            const cidade = document.getElementById('cidade').value;
            const estado = document.getElementById('estado').value;
            const cep = document.getElementById('cep').value;

            // Formata a data de nascimento para o formato YYYY-MM-DD
            const dataNascimentoFormatada = dataNascimento.split('/').reverse().join('-');

            data = {
                nome,
                sobrenome,
                data_nascimento: dataNascimentoFormatada,
                id_sexo: idSexo,
                quadra,
                numero,
                bairro,
                cidade,
                estado,
                cep
            };

        } else if (dynamicPath === 'pedagoga') {
            const nome = document.getElementById('nome').value;
            const sobrenome = document.getElementById('sobrenome').value;
            const cpf = document.getElementById('cpf').value;
            const numeroSala = document.getElementById('numero_sala').value;
            const idSexo = document.getElementById('id_sexo').value;

            data = {
                Nome: nome,
                Sobrenome: sobrenome,
                CPF: cpf,
                Numero_sala: numeroSala,
                ID_Sexo: idSexo
            };
        }

        // Faz uma requisição PUT para atualizar os dados no servidor
        fetch(`http://localhost:3000/${dynamicPath}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Envia os dados em formato JSON
        })
            .then(response => {
                if (response.ok) {
                    // Redireciona para a página de listagem após a atualização bem-sucedida
                    window.location.href = `http://127.0.0.1:5500/src/${dynamicPath}/list/index.html`;
                } else {
                    console.error('Erro ao atualizar registro:', response.statusText);
                }
            })
            .catch(error => console.error('Erro ao atualizar registro:', error));
    });

    // Adiciona um evento ao botão de cancelar para redirecionar para a página de listagem
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', function () {
            window.location.href = `http://127.0.0.1:5500/src/${dynamicPath}/list/`;
        });
    }
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