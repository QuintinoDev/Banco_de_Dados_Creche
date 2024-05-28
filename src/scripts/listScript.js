// Divide o caminho da URL atual em partes usando '/' como delimitador e armazena a terceira parte na variável dynamicPath
const pathParts = window.location.pathname.split('/');
const dynamicPath = pathParts[2];

// Adiciona um ouvinte de evento que será executado quando o conteúdo do DOM for totalmente carregado
document.addEventListener('DOMContentLoaded', function () {
    // Faz uma solicitação HTTP GET para obter dados da URL especificada com base no dynamicPath
    fetch(`http://localhost:3000/${dynamicPath}`)
        .then(response => response.json()) // Converte a resposta em JSON
        .then(data => {
            // Seleciona o elemento <tbody> no documento HTML
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = ''; // Limpa qualquer conteúdo existente dentro do <tbody>

            // Itera sobre os itens de dados retornados da solicitação
            data.forEach(item => {
                // Cria uma nova linha de tabela <tr>
                const row = document.createElement('tr');
                let itemId;

                // Verifica se o dynamicPath é 'crianca' e preenche a linha da tabela com os dados apropriados
                if (dynamicPath === 'crianca') {
                    itemId = item.id; // Define itemId com o valor do id do item
                    row.innerHTML = `
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.nome}</td>
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.sobrenome}</td>
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${new Date(item.data_nascimento).toLocaleDateString('pt-BR')}</td>
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.numero}</td>
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.quadra}</td>
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.bairro}</td>
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.cidade}</td>
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.estado}</td>
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.cep}</td>
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.sexo}</td>
                        <td class="px-6 py-4 text-center">
                            <button class="text-white bg-blue-700 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center" data-id="${itemId}" onclick="editButton(this)">Editar</button>
                        </td>
                        <td class="px-6 py-4 text-center">
                            <button class="text-white bg-red-700 hover:bg-red-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center" data-id="${itemId}" data-action="delete">Deletar</button>
                        </td>
                    `;
                }

                // Verifica se o dynamicPath é 'pedagoga' e preenche a linha da tabela com os dados apropriados
                if (dynamicPath === 'pedagoga') {
                    itemId = item.id; // Define itemId com o valor do id do item
                    console.log(data); // Exibe os dados no console
                    row.innerHTML = `
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.nome}</td>
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.sobrenome}</td>
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.cpf}</td>
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.numero_sala}</td>
                        <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">${item.sexo}</td>
                        <td class="px-6 py-4 text-center">
                            <button class="text-white bg-blue-700 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center" data-id="${itemId}" onclick="editButton(this)">Editar</button>
                        </td>
                        <td class="px-6 py-4 text-center">
                            <button class="text-white bg-red-700 hover:bg-red-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center" data-id="${itemId}" data-action="delete">Deletar</button>
                        </td>
                    `;
                }

                // Adiciona a linha criada ao <tbody>
                tbody.appendChild(row);

                // Seleciona o botão de deletar na linha e adiciona um ouvinte de evento de clique
                const deleteButton = row.querySelector('button[data-action="delete"]');
                deleteButton.addEventListener('click', () => {
                    const rowId = deleteButton.getAttribute('data-id'); // Obtém o ID do item a ser deletado
                    handleDelete(rowId); // Chama a função handleDelete para excluir o item
                });
            });
        })
        .catch(error => console.error('Error fetching data:', error)); // Trata qualquer erro na solicitação
});

// Função para redirecionar o usuário para a página de registro
function registerButton() {
    window.location.href = `/src/${dynamicPath}/register/index.html`;
}

// Função para redirecionar o usuário para a página de edição com o ID do item
function editButton(rowId) {
    const id = rowId.getAttribute('data-id');
    window.location.href = `/src/${dynamicPath}/edit/index.html?id=${id}`;
}

// Função para excluir um item com base no ID fornecido
function handleDelete(id) {
    fetch(`http://localhost:3000/${dynamicPath}/${id}`, {
        method: 'DELETE' // Faz uma solicitação HTTP DELETE
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete item'); // Lança um erro se a solicitação falhar
            }
            return response.json();
        })
        .then(data => {
            console.log('Item deletado:', data); // Exibe a mensagem de sucesso no console
            window.location.reload(); // Recarrega a página para refletir a exclusão
        })
        .catch(error => console.error('Error deleting item:', error)); // Trata qualquer erro na solicitação de exclusão
}
