

# [🔗 URL](https://brain-agriculture-nameless-brook-7397.fly.dev/api) Brain Agriculture - Backend (NestJS + TypeScript) 



Este projeto é um **Backend** para gerenciamento de produtores rurais, fazendas e culturas, com foco em boas práticas de código, testes e documentação. A solução foi desenvolvida usando **NestJS**, **TypeScript**, **Docker**, **PostgreSQL** e **Swagger**.

---

## 1. Descrição Geral

O objetivo é criar e gerenciar:

- **Produtores Rurais** (CPF ou CNPJ, nome do produtor).
- **Propriedades Rurais (Fazendas)** (nome, cidade, estado, áreas em hectares).
- **Culturas** (por safra, ex.: Soja na Safra 2021).

#### Principais Regras de Negócio

1. **Validação de CPF ou CNPJ**: Não pode haver duplicidade; deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ).
2. **Áreas**: A soma de área agricultável + área de vegetação **não** pode exceder a área total da fazenda.
3. **Associações**:
   - Um produtor pode ter 0, 1 ou mais fazendas.
   - Uma fazenda pode ter 0, 1 ou mais culturas (por safra).
4. **Dashboard**: Agrega dados para visualização estatística, como:
   - Total de fazendas cadastradas (quantidade).
   - Total de hectares registrados (área total).
   - Distribuição por estado, por cultura, e por uso do solo (área agricultável vs. vegetação).

---

## 2. Principais Tecnologias e Bibliotecas

- **NestJS** (framework para Node.js)
- **TypeScript** (tipagem estática)
- **TypeORM** (ORM para interação com banco de dados)
- **PostgreSQL** (SGBD)
- **Docker** e **Docker Compose** (containerização)
- **Swagger** (documentação de API)
- **Jest** (framework de testes)
- **Class-Validator**, **Class-Transformer** (validação de DTOs)
- **Fly.io**, (Para realizar o deploy)

---

## 3. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (exemplo):

POSTGRES_HOST=database
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=brain_agriculture_db
APP_PORT=3000
NODE_ENV=development

> **Atenção**: Em produção, utilize valores seguros e não versione o arquivo `.env` em repositórios públicos.

---

## 4. Como Executar com Docker

### 4.1 Pré-requisitos

- **Docker** instalado
- **Docker Compose** instalado

### 4.2 Rodar a aplicação

Na raiz do projeto (onde está o `docker-compose.yml`), execute:

docker-compose up --build

Isso irá:

1. **Subir um container** com PostgreSQL (imagem `postgres:15-alpine`), na porta **5432**.
2. **Subir o container** da aplicação NestJS (exposto na porta configurada em `APP_PORT`, por padrão 3000).

Quando ambos estiverem prontos, você poderá acessar a aplicação em:
http://localhost:3000

### 4.3 Documentação Swagger

Abra em seu navegador:
http://localhost:3000/api

Lá, você encontrará a documentação **Swagger** com todos os endpoints, descrições e modelos de request/response.

---

## 5. Executando Testes Unitários

A aplicação foi configurada com **Jest**. Existem testes unitários que validam as regras de negócio de **Produtores, Fazendas e Culturas**.

Para rodar os testes localmente (fora do Docker), instale as dependências e execute:

npm install
npm run test

Opcionalmente, você pode configurar seu Docker para rodar testes, mas o mais comum é executar localmente em seu ambiente de desenvolvimento.

---

## 6. Acessando o Projeto

- **Aplicação**: [http://localhost:3000](http://localhost:3000)
- **Swagger**: [http://localhost:3000/api](http://localhost:3000/api)

**Rotas Principais** (exemplos):
- `POST /producers` – cria produtor
- `GET /producers` – lista produtores
- `PATCH /producers/:id` – atualiza produtor
- `DELETE /producers/:id` – exclui produtor
- `POST /farmlands` – cria fazenda
- `GET /farmlands` – lista fazendas
- `PATCH /farmlands/:id` – atualiza fazenda
- `DELETE /farmlands/:id` – exclui fazenda
- `POST /crops` – cria cultura
- `GET /crops` – lista culturas
- `DELETE /crops/:id` – exclui cultura
- `GET /dashboard` – retorna dados agregados para o dashboard

---

## 7. Resumo das Funcionalidades (Possui testes para garantir todas essas funcionalidades)

- **Produtores**:
  - Valida se o `cpfOrCnpj` já existe (lança erro se duplicado).
  - Pode criar, listar, buscar por ID, atualizar e excluir.

- **Fazendas**:
  - Pertence a um produtor.
  - Valida se `arableAreaInHectares + vegetationAreaInHectares <= totalAreaInHectares`.
  - Pode criar, listar, buscar por ID, atualizar e excluir.

- **Culturas**:
  - Pertencem a uma fazenda (Farm).
  - Pode criar, listar, buscar por ID, atualizar e excluir.

- **Dashboard**:
  - Agrega dados: total de fazendas, hectares, estatísticas por estado, por cultura e uso do solo.

---

## 8. Dicas Finais

- Para simular dados rapidamente, você pode criar um serviço de **seeds** (ex.: `MockSeedsService`) para inserir registros fake no banco, facilitando testes manuais.
- A aplicação possui **relacionamentos** configurados com `cascade: true` e `onDelete: 'CASCADE'`. Ou seja, ao excluir um **Produtor**, suas **Fazendas** (e respectivas **Culturas**) também são excluídas.

