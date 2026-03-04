# Tutorial: API REST com Node.js, Express e Sequelize para Controle de Pedidos (Microsserviços)

## Introdução

Este projeto demonstra a transformação de uma aplicação monolítica em microsserviços usando Node.js, Express, Sequelize e MySQL. Temos três serviços independentes:

- **Cliente Service**: Gerencia clientes (CRUD).
- **Pedido Service**: Gerencia pedidos (CRUD), validando clientes via HTTP.
- **Produto Service**: Gerencia produtos (CRUD), que pode ser integrado ao pedido para validação (opcional, mas implementado).

Cada serviço tem seu próprio banco de dados e API REST. A comunicação é síncrona via HTTP.

Benefícios: Escalabilidade, isolamento de falhas e deploy independente.

## Objetivos

- Separar domínios em serviços independentes.
- Comunicação síncrona entre serviços.
- Bancos MySQL separados.
- CRUD completo para Clientes, Pedidos e Produtos.
- Estrutura organizada (models, controllers, routes).

## Tecnologias

- Node.js (v18+)
- Express
- Sequelize
- MySQL
- dotenv
- node-fetch (para comunicação entre serviços, se Node <18)
- Postman/Insomnia para testes

## Estrutura do Projeto

nodejs-microservices/
├── cliente-service/

│   ├── app.js

│   ├── .env

│   ├── package.json

│   ├── config/database.js

│   ├── models/Cliente.js

│   ├── controllers/cliente.controller.js

│   ├── routes/cliente.routes.js

├── pedido-service/

│   ├── app.js

│   ├── .env

│   ├── package.json

│   ├── config/database.js

│   ├── models/Pedido.js

│   ├── controllers/pedido.controller.js

│   ├── routes/pedido.routes.js

├── produto-service/

│   ├── app.js

│   ├── .env

│   ├── package.json

│   ├── config/database.js

│   ├── models/Produto.js

│   ├── controllers/produto.controller.js

│   ├── routes/produto.routes.js

├── start-all.sh (ou start-all.js)  // Script para instalar e rodar tudo

└── README.md

## Requisitos

- Node.js v18 ou superior.
- MySQL instalado e rodando (crie usuário root com senha).
- Ferramenta para testes de API (ex: Postman).

## Configuração Inicial

1. **Crie os bancos de dados no MySQL**:
   - `CREATE DATABASE cliente_db;`
   - `CREATE DATABASE pedido_db;`
   - `CREATE DATABASE produto_db;`

2. **Configure os .env** em cada serviço (substitua `ifsp`):
   - cliente-service/.env:
    DB_NAME=cliente_db
    DB_USER=root
    DB_PASS=ifsp
    DB_HOST=localhost
    PORT=3001

   - pedido-service/.env (adicione URL do cliente e produto se integrado):
    DB_NAME=pedido_db
    DB_USER=root
    DB_PASS=ifsp
    DB_HOST=localhost
    CLIENTE_SERVICE_URL=<http://localhost:3001/clientes>
    PRODUTO_SERVICE_URL=<http://localhost:3003/produtos>  // Se integrado
    PORT=3002

   - produto-service/.env:
    DB_NAME=produto_db
    DB_USER=root
    DB_PASS=ifsp
    DB_HOST=localhost
    PORT=3003

3. **Instale dependências e rode os serviços**:

- Use o script `start-all.sh` (ou `start-all.js`) na raiz:
- Primeiro, instale `concurrently` global: `npm install -g concurrently`
- Rode: `bash start-all.sh` (ou `node start-all.js` para a versão JS).
- Isso instala npm em cada pasta e inicia todos os serviços de uma vez (portas 3001, 3002, 3003).

Se preferir manual:

- Em cada pasta: `npm install`
- Depois: `npm start` em terminais separados.

## Como Rodar

- Rode o script: `bash start-all.sh`
- Serviços estarão em:
- Cliente: <http://localhost:3001>
- Pedido: <http://localhost:3002>
- Produto: <http://localhost:3003>

- Para parar: Ctrl+C no terminal.

## Como Enviar Requisições (API Usage)

Use Postman ou curl para testar. Todos endpoints são RESTful e usam JSON.

### Cliente Service[](http://localhost:3001/clientes)

- **GET /**: Lista todos clientes.
- Exemplo: `curl http://localhost:3001/clientes`

- **GET /:id**: Busca cliente por ID.
- Exemplo: `curl http://localhost:3001/clientes/1`

- **POST /**: Cria cliente.
- Body: `{ "nome": "João", "email": "joao@email.com" }`
- Exemplo: `curl -X POST -H "Content-Type: application/json" -d '{"nome":"João","email":"joao@email.com"}' http://localhost:3001/clientes`

- **PUT /:id**: Atualiza cliente.
- Body: `{ "nome": "João Atualizado" }`
- Exemplo: `curl -X PUT -H "Content-Type: application/json" -d '{"nome":"João Atualizado"}' http://localhost:3001/clientes/1`

- **DELETE /:id**: Deleta cliente.
- Exemplo: `curl -X DELETE http://localhost:3001/clientes/1`

### Pedido Service[](http://localhost:3002/pedidos)

- **GET /**: Lista todos pedidos.
- Exemplo: `curl http://localhost:3002/pedidos`

- **GET /:id**: Busca pedido por ID.
- Exemplo: `curl http://localhost:3002/pedidos/1`

- **POST /**: Cria pedido (valida clienteId via HTTP).
- Body: `{ "descricao": "Pedido Teste", "valor": 100.50, "clienteId": 1, "produtoIds": [1, 2] }` (se integrado com produtos)
- Exemplo: `curl -X POST -H "Content-Type: application/json" -d '{"descricao":"Pedido Teste","valor":100.50,"clienteId":1}' http://localhost:3002/pedidos`

- **PUT /:id**: Atualiza pedido.
- Similar ao POST.

- **DELETE /:id**: Deleta pedido.

### Produto Service[](http://localhost:3003/produtos)

- **GET /**: Lista todos produtos.
- Exemplo: `curl http://localhost:3003/produtos`

- **GET /:id**: Busca produto por ID.
- Exemplo: `curl http://localhost:3003/produtos/1`

- **POST /**: Cria produto.
- Body: `{ "nome": "Notebook", "preco": 3500.00 }`
- Exemplo: `curl -X POST -H "Content-Type: application/json" -d '{"nome":"Notebook","preco":3500}' http://localhost:3003/produtos`

- **PUT /:id**: Atualiza produto.
- Similar ao POST.

- **DELETE /:id**: Deleta produto.

## Notas

- O pedido valida o cliente (e produtos, se configurado) antes de salvar.
- Erros: Retorna JSON com mensagem (ex: 404 para não encontrado).
- Expanda adicionando mais serviços ou integrações.

