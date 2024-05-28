// Importa as bibliotecas necessarias para o projeto
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');

// Cria uma instância do aplicativo Express
const app = express();
const port = 3000;

// Configura middlewares para servir arquivos estáticos, habilitar CORS e analisar JSON e dados de URL
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cria uma conexão com o banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'creche'
});

// Rota para obter um registro específico de uma tabela pelo ID
app.get("/:tableName/:id", (req, res) => {
    const { tableName, id } = req.params;
    let query;

    // Constrói a consulta SQL para selecionar o registro com base na tabela e ID fornecidos
    query = `SELECT * FROM ${mysql.escapeId(tableName)} WHERE id_${tableName} = ${parseInt(id)}`;

    // Executa a consulta no banco de dados
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
        // Retorna o resultado da consulta como JSON
        res.json(results[0]);
    });
});

// Rota para obter todos os números de sala da tabela 'turma'
app.get("/salas", (req, res) => {
    const query = "SELECT numero_sala FROM turma";

    // Executa a consulta no banco de dados
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
        // Retorna os resultados da consulta como JSON
        res.json(results);
    });
});

// Rota para obter todos os registros de uma tabela específica
app.get("/:tableName", (req, res) => {
    const { tableName } = req.params;
    let query;

    // Constrói a consulta SQL dependendo da tabela solicitada
    if (tableName === 'crianca') {
        query = `SELECT id_crianca AS id, nome, sobrenome, data_nascimento, numero, quadra, bairro, cidade, estado, cep, s.tipo_sexo AS sexo
                 FROM ${mysql.escapeId(tableName)} c 
                 JOIN sexo s ON c.id_sexo = s.id_sexo`;
    } else if (tableName === 'pedagoga') {
        query = `SELECT id_pedagoga AS id, id_pedagoga, nome, sobrenome, cpf, s.tipo_sexo AS sexo, t.numero_sala
                FROM ${mysql.escapeId(tableName)} p
                JOIN sexo s ON p.id_sexo = s.id_sexo
                JOIN turma t ON p.numero_sala = t.numero_sala`;
    }

    // Executa a consulta no banco de dados
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
        // Retorna os resultados da consulta como JSON
        res.json(results);
    });
});

// Rota para inserir um novo registro em uma tabela específica
app.post("/:tableName", (req, res) => {
    const { tableName } = req.params;
    const data = req.body;

    // Constrói a consulta SQL para inserir os dados fornecidos na tabela especificada
    const fields = Object.keys(data).map(key => mysql.escapeId(key)).join(', ');
    const values = Object.values(data).map(value => mysql.escape(value)).join(', ');

    const query = `INSERT INTO ${mysql.escapeId(tableName)} (${fields}) VALUES (${values})`;

    // Executa a consulta no banco de dados
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
        // Retorna uma mensagem de sucesso e os resultados da inserção
        res.json({ message: "Registro inserido com sucesso", results });
    });
});

// Rota para atualizar um registro existente em uma tabela específica
app.put("/:tableName/:id", (req, res) => {
    const { tableName, id } = req.params;
    const updateData = req.body;

    // Constrói a consulta SQL para atualizar os dados fornecidos no registro especificado
    const setQuery = Object.keys(updateData).map(key => `${mysql.escapeId(key)} = ${mysql.escape(updateData[key])}`).join(', ');

    let idField;
    let query;

    idField = `id_${tableName}`;
    query = `UPDATE ${mysql.escapeId(tableName)} SET ${setQuery} WHERE ${mysql.escapeId(idField)} = ${mysql.escape(id)}`;

    // Executa a consulta no banco de dados
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
        // Retorna uma mensagem de sucesso e os resultados da atualização
        res.json({ message: "Registro atualizado com sucesso", results });
    });
});

// Rota para excluir um registro de uma tabela específica
app.delete("/:tableName/:id", (req, res) => {
    const { tableName, id } = req.params;
    let query;

    // Constrói a consulta SQL para excluir o registro com base na tabela e ID fornecidos
    if (tableName === 'crianca') {
        query = `DELETE FROM ${mysql.escapeId(tableName)} WHERE id_crianca = ?`;
    } else if (tableName === 'pedagoga') {
        query = `DELETE FROM ${mysql.escapeId(tableName)} WHERE id_pedagoga = ?`;
    } else {
        query = `DELETE FROM ${mysql.escapeId(tableName)} WHERE id = ?`;
    }

    // Executa a consulta no banco de dados
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
        // Retorna uma mensagem de sucesso
        res.json({ message: "Record deleted successfully" });
    });
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
