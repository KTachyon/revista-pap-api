# API Revista P@P

Em desenvolvimento

## Tech Stack

NodeJS
Express
Sequelize
PostgreSQL

## Requisitos

- PostgreSQL
- NodeJS

## Setup

1. Criar uma base de dados no PostgreSQL
	* A partir do psql, na linha de comandos `CREATE DATABASE revista_pap;`
2. Duplica o ficheiro configuration/configuration.example.js para a mesma pasta, dá-lhe o nome configuration.js e altera os valores que forem necessários no topo do ficheiro
3. Instala as dependencias do projecto, cria o schema da base de dados e carrega-a com dados:
	* Navega até à pasta do projecto e executa os seguintes comandos:
```
npm install
node generator/SchemaGenerator.js
node generator/DataGenerator.js
```