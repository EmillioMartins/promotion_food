# Food Promotion API

API independente do frontend, criada com Node.js e Express.

## Requisitos

- Node.js 20 ou superior
- PostgreSQL disponível para as próximas rotas que usarem o banco

## Desenvolvimento local

No PowerShell, dentro da raiz do repositório:

```powershell
Copy-Item back-end/.env.example back-end/.env
npm --prefix back-end install express cors dotenv pg
npm --prefix back-end run dev
```

A API inicia em `http://localhost:3000`. Verifique o servidor em `GET /api/health`.

As configurações PostgreSQL ficam em `back-end/.env`. O módulo `src/config/database.js` exporta o pool e uma função simples de teste de conexão; a conexão só ocorre quando uma consulta é executada.

## Fixtures da API

Os payloads de exemplo ficam em `back-end/mocks/` e são carregados por `src/fixtures/index.js`. Os mapeadores mantêm o contrato documentado em `back-end/mocks/README.md`, recalculam descontos pela data de vencimento, omitem senhas das respostas de usuários e validam referências de clientes e produtos nos pedidos.

Execute `npm --prefix back-end test` para validar os mapeamentos e as referências entre fixtures. As credenciais em `users.json` são somente dados de teste e não devem ser usadas como autenticação de produção.
