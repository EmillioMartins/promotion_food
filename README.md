<div align="center">

# 🏷️ Food Promotion Microservice

> **Microserviço de Gestão de Promoções e Descontos por Vencimento de Produtos.**

[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#-iniciando-o-projeto-com-docker)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-orange?style=for-the-badge)](#-arquitetura-e-padroes)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#-licenca)

</div>

---

## 📌 Sobre o Projeto

O **Food Promotion** é um microserviço integrante da plataforma de autoatendimento para supermercados. Sua finalidade é gerenciar **campanhas promocionais**, aplicando **descontos dinâmicos em produtos próximos da data de vencimento**.

Com isso, o estabelecimento reduz perdas de estoque (desperdício de alimentos) e disponibiliza preços reduzidos aos clientes no totem ou aplicativo de pedidos.

## Estrutura consolidada

`Novo-promotion` usa a aplicação de `food-promotion` como frontend principal. As outras implementações e os serviços da equipe foram mantidos em subpastas, sem misturar aplicações com interfaces e contratos de API diferentes:

- `src/` e `back-end/`: aplicação principal e API original.
- `frontend-alternativo/`: implementação de `food-promotion-main`.
- `equipe/frontend/` e `equipe/server/`: aplicação da equipe integrada à API com mensageria RabbitMQ.
- `equipe/backend/`: API CRUD de usuários e publicações, com controllers em classes e Prisma/SQLite. Consulte [equipe/backend/README.md](./equipe/backend/README.md).

As pastas originais foram preservadas. Os repositórios Git não foram copiados; as dependências foram instaladas no destino a partir dos lockfiles, e os builds podem ser gerados novamente com os comandos abaixo.

### Aplicação principal

```bash
npm ci
npm run dev
```

Para gerar o build e executar os testes:

```bash
npm run build
npm test
```

### Aplicação e API da equipe

Com Docker Desktop em execução:

```bash
docker compose -f equipe/frontend/docker-compose.yml up --build
```

A aplicação da equipe fica em `http://localhost:5173`; a API fica em `http://localhost:3000`. Consulte [equipe/API.md](./equipe/API.md) para rotas, autenticação e mensageria. Para testar a API da equipe sem Docker, instale as dependências com `npm --prefix equipe/server ci` e execute `npm --prefix equipe/server test`.

### Frontend alternativo

Para executar a implementação alternativa:

```bash
npm --prefix frontend-alternativo ci
npm --prefix frontend-alternativo run dev
```

---

## 🛠️ Tech Stack & Arquitetura

- **Linguagem & Runtime:** React.js 
- **Containerização:** Docker e Docker Compose

---

## 🚀 Iniciando o Projeto com Docker

### 📋 Pré-requisitos
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.
* [Git](https://git-scm.com/) instalado.

---

### Execução Padrão (Nginx)

1. Clone o repositório e entre na pasta:
   ```bash
   git clone https://github.com/fullcycle-gt4/food-promotion
   cd food-promotion
   ```

2. Copie `.env.example` para `.env` (PowerShell: `Copy-Item .env.example .env`; Bash: `cp .env.example .env`). Altere `POSTGRES_USER` e substitua o valor de exemplo de `POSTGRES_PASSWORD`; ajuste também `APP_PORT`, `DEV_PORT` ou `DB_PORT` se necessário. O Compose exige essas credenciais via `.env`. Esse arquivo é ignorado pelo Git e não deve ser versionado.

3. Construa a imagem e inicie o frontend:
   ```bash
   docker compose up -d --build
   ```

4. Confira o estado dos containers e a saúde da aplicação; depois abra `http://localhost:8080` (ou a porta definida em `APP_PORT`). O endpoint `GET /health` deve responder `200` com `ok`:
   ```bash
   docker compose ps
   curl http://localhost:8080/health
   ```

5. Para parar e remover os containers sem apagar os dados persistidos:
   ```bash
   docker compose down
   ```

O banco usa o volume nomeado `postgres_data`, que é mantido por `docker compose down`. Não use `docker compose down -v` se quiser preservar os dados.

### Desenvolvimento (Vite)

1. Inicie o perfil de desenvolvimento com hot reload:
   ```bash
   docker compose --profile dev up -d --build frontend-dev
   ```

2. Acesse `http://localhost:5173` (ou a porta definida em `DEV_PORT`). O código do workspace é montado no container; `node_modules` usa um volume Docker separado.

3. Para parar o serviço de desenvolvimento:
   ```bash
   docker compose --profile dev down
   ```

O frontend atual ainda utiliza dados mockados e não lê nem grava no PostgreSQL. O banco já é iniciado e persistido pelo Compose para a integração com uma API futura.

👥 Equipe do ProjetoDesenvolvido pelo grupo GT4 - Full Cycle.

GitHub: https://github.com/DeilsonGilmar 
GitHub: https://github.com/senna47 
GitHub: https://github.com/pomptrash 
GitHub: https://github.com/amandapaulav 
GitHub: https://github.com/pedrorochaneto 
GitHub: https://github.com/EmillioMartins 
