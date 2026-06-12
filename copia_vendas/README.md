# 📦 FNR — Controle de Vendas

Sistema web de controle de vendas desenvolvido para gerenciar pedidos, clientes, fornecedores, produtos, vendedores e agenda de forma centralizada.


## 📋 Sumário

- [Sobre o Sistema](#sobre-o-sistema)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Como Rodar](#como-rodar)
- [Primeiro Acesso](#primeiro-acesso)
- [User Stories — Funcionalidades](#user-stories--funcionalidades)

---

## Sobre o Sistema

O **FNR Controle de Vendas** é uma aplicação full-stack voltada para equipes comerciais. Permite o cadastro e acompanhamento completo do ciclo de vendas: desde o cadastro de clientes e fornecedores, passando pela gestão do estoque de produtos, até o lançamento e acompanhamento de pedidos. Conta ainda com um módulo de agenda para agendamento de visitas e follow-ups, e um dashboard com gráficos e indicadores em tempo real.

---

## Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│         React 19 + TypeScript + Vite                │
│              Material UI + Chart.js                 │
│           http://localhost:5173                     │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (Axios)
                       ▼
┌─────────────────────────────────────────────────────┐
│                    BACKEND                          │
│         Node.js + TypeScript + Express              │
│           http://localhost:3333                     │
│                                                     │
│  ┌──────────────┐   ┌────────────────────────────┐  │
│  │  Middlewares │   │       Controllers          │  │
│  │  - Auth JWT  │──▶│  auth / clientes /         │  │
│  │  - CORS      │   │  fornecedores / pedidos /  │  │
│  │  - Expiração │   │  produtos / categorias /   │  │
│  └──────────────┘   │  vendedores / agenda       │  │
│                     └──────────────┬───────────── ┘  │
└────────────────────────────────────┼────────────────┘
                                     │ Prisma ORM
                                     ▼
                         ┌───────────────────────┐
                         │   SQLite (dev.db)      │
                         │                       │
                         │  usuarios             │
                         │  vendedores           │
                         │  clientes             │
                         │  fornecedores         │
                         │  categorias           │
                         │  produtos             │
                         │  pedidos              │
                         │  pedido_produto       │
                         │  agenda               │
                         └───────────────────────┘
```

### Fluxo de autenticação

1. Usuário faz login com email/senha
2. Backend valida e retorna um **JWT** (expira em 30 min)
3. Frontend armazena o token no `localStorage`
4. Todas as requisições protegidas enviam o token no header `Authorization: Bearer <token>`
5. O middleware de autenticação valida o token em cada rota protegida

---

## Tecnologias

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Frontend | React | 19 |
| Frontend | TypeScript | 5.8 |
| Frontend | Vite | 6 |
| Frontend | Material UI | 7 |
| Frontend | Chart.js + react-chartjs-2 | 4 / 5 |
| Frontend | React Router DOM | 7 |
| Frontend | Axios | 1.9 |
| Backend | Node.js | 20+ |
| Backend | TypeScript | 5.3 |
| Backend | Express | 4.18 |
| Backend | Prisma ORM | 5.7 |
| Backend | JWT (jsonwebtoken) | 9 |
| Backend | bcryptjs | 2.4 |
| Banco de dados | SQLite | — |

---

## Estrutura de Pastas

```
copia_vendas/
├── back/                        # Backend
│   ├── prisma/
│   │   ├── schema.prisma        # Modelos do banco de dados
│   │   ├── seed.ts              # Dados iniciais
│   │   └── dev.db               # Banco SQLite
│   └── src/
│       ├── app.ts               # Configuração do Express e rotas
│       ├── server.ts            # Ponto de entrada
│       ├── config/prisma.ts     # Instância do Prisma
│       ├── controllers/         # Lógica de cada módulo
│       ├── middlewares/         # Auth JWT
│       └── routes/              # Definição das rotas
│
├── front/                       # Frontend
│   ├── index.html
│   └── src/
│       ├── App.tsx              # Rotas e proteção de expiração
│       ├── main.tsx
│       ├── components/          # Layout, Navbar, Sidebar, PrivateRoute
│       ├── contexts/            # AuthContext (login/logout global)
│       ├── pages/               # Uma pasta por módulo
│       │   ├── Login/
│       │   ├── Cadastro/
│       │   ├── Dashboard/
│       │   ├── Clientes/
│       │   ├── Fornecedores/
│       │   ├── Pedidos/
│       │   ├── Produtos/
│       │   ├── Categorias/
│       │   ├── Vendedores/
│       │   └── Agenda/
│       └── services/api.ts      # Instância do Axios com interceptors
│
└── README.md
```

---

## Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- npm v9 ou superior

### 1. Backend

```bash
cd back

# Instalar dependências
npm install

# Criar o arquivo de variáveis de ambiente
cp .env.example .env

# Criar as tabelas no banco de dados
npx prisma migrate dev

# Iniciar o servidor
npm start
```

O backend estará disponível em **http://localhost:3333**

### 2. Frontend

```bash
cd front

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm start

# Executar os testes
npm test
```

O frontend estará disponível em **http://localhost:5173**

---

## 🧪 Como Executar os Testes Automatizados

O projeto possui testes automatizados implementados no frontend utilizando **Jest** e **React Testing Library**.

Os testes contemplam os módulos de **Clientes** e **Produtos**, validando cenários positivos e negativos, incluindo:

- renderização das telas;
- abertura de formulários;
- preenchimento de campos;
- envio de dados válidos;
- simulação de erro no cadastro;
- validação da exibição de mensagens de erro.

### Acessar a pasta do frontend

```bash
cd copia_vendas/front
```

### Instalar as dependências

```bash
npm install
```

### Executar os testes

```bash
npm test
```

### Resultado esperado

A execução deve apresentar as suítes e testes aprovados:

```text
Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
```

### Arquivos de teste

Os testes automatizados estão localizados em:

```text
copia_vendas/front/src/pages/Clientes/Clientes.test.tsx
copia_vendas/front/src/pages/Produtos/Produtos.test.tsx
```

### Ferramentas utilizadas nos testes

- Jest;
- ts-jest;
- jest-environment-jsdom;
- React Testing Library;
- @testing-library/jest-dom.

### Acessar a pasta do frontend

```bash
cd copia_vendas/front

---

## Primeiro Acesso

1. Acesse **http://localhost:5173**
2. Clique em **"Primeiro cadastro"**
3. Preencha nome, e-mail e senha
4. O primeiro usuário cadastrado se torna **administrador** automaticamente
5. Faça login com as credenciais cadastradas

> Se o banco já tiver sido populado com o seed, utilize:
> - **Email:** `admin@vendas.com`
> - **Senha:** `admin123`

---

## User Stories — Funcionalidades

### 🔐 Autenticação

| ID | Como... | Quero... | Para... |
|----|---------|----------|---------|
| US01 | Usuário novo | Me cadastrar com nome, e-mail e senha | Ter acesso ao sistema |
| US02 | Usuário cadastrado | Fazer login com e-mail e senha | Acessar o sistema com segurança |
| US03 | Usuário logado | Ser desconectado automaticamente após inatividade | Proteger minha conta |
| US04 | Usuário | Ver mensagem de erro se o e-mail já estiver cadastrado | Evitar duplicidades |

---

### 📊 Dashboard

| ID | Como... | Quero... | Para... |
|----|---------|----------|---------|
| US05 | Usuário logado | Ver o total de clientes, fornecedores e produtos | Ter visão geral do sistema |
| US06 | Usuário logado | Ver gráfico de pedidos por cliente | Identificar os maiores compradores |
| US07 | Usuário logado | Ver gráfico de pedidos por mês | Analisar a evolução das vendas ao longo do tempo |

---

### 👥 Clientes

| ID | Como... | Quero... | Para... |
|----|---------|----------|---------|
| US08 | Vendedor | Cadastrar um novo cliente com nome, CPF/CNPJ, responsável, telefone, e-mail e endereço | Registrar minha base de clientes |
| US09 | Vendedor | Listar todos os clientes ativos | Consultar rapidamente |
| US10 | Vendedor | Editar os dados de um cliente | Manter as informações atualizadas |
| US11 | Vendedor | Inativar um cliente | Remover sem excluir o histórico |
| US12 | Administrador | Reativar um cliente inativado | Restabelecer o relacionamento comercial |

---

### 🏭 Fornecedores

| ID | Como... | Quero... | Para... |
|----|---------|----------|---------|
| US13 | Usuário | Cadastrar fornecedor com CNPJ, razão social, responsável, telefone, e-mail e endereço | Manter o cadastro de fornecedores |
| US14 | Usuário | Listar e editar fornecedores | Manter dados atualizados |
| US15 | Usuário | Inativar/reativar fornecedores | Controlar quais fornecedores estão em uso |

---

### 📦 Produtos

| ID | Como... | Quero... | Para... |
|----|---------|----------|---------|
| US16 | Usuário | Cadastrar produto com tipo, quantidade, valor unitário, valor total, unidade de medida e categoria | Montar o catálogo de produtos |
| US17 | Usuário | Listar e filtrar produtos por categoria | Localizar itens rapidamente |
| US18 | Usuário | Editar informações de um produto | Manter o estoque atualizado |
| US19 | Usuário | Inativar um produto | Retirar do uso sem apagar o histórico |

---

### 🗂️ Categorias

| ID | Como... | Quero... | Para... |
|----|---------|----------|---------|
| US20 | Administrador | Criar categorias de produtos | Organizar o catálogo |
| US21 | Administrador | Editar e inativar categorias | Manter a organização atualizada |

---

### 🛒 Pedidos

| ID | Como... | Quero... | Para... |
|----|---------|----------|---------|
| US22 | Vendedor | Criar um pedido vinculado a cliente, fornecedor, vendedor e categoria | Registrar uma venda ou ordem de compra |
| US23 | Vendedor | Adicionar produtos a um pedido com quantidade e valor | Detalhar os itens do pedido |
| US24 | Vendedor | Informar modalidade de frete, transportadora, forma e condição de pagamento | Registrar as condições comerciais |
| US25 | Vendedor | Definir data prevista e data de entrega | Acompanhar prazos |
| US26 | Vendedor | Marcar um pedido como entregue | Atualizar o status da venda |
| US27 | Usuário | Listar, filtrar e visualizar pedidos | Acompanhar o andamento das vendas |
| US28 | Administrador | Cancelar/inativar um pedido | Registrar cancelamentos sem perder histórico |

---

### 🧑‍💼 Vendedores

| ID | Como... | Quero... | Para... |
|----|---------|----------|---------|
| US29 | Administrador | Cadastrar vendedores com nome, e-mail, telefone e descrição | Gerenciar a equipe comercial |
| US30 | Administrador | Editar dados de um vendedor | Manter o cadastro atualizado |
| US31 | Administrador | Inativar e reativar vendedores | Controlar quem está ativo na equipe |

---

### 📅 Agenda

| ID | Como... | Quero... | Para... |
|----|---------|----------|---------|
| US32 | Vendedor | Criar um agendamento vinculado a cliente e vendedor com data e observação | Planejar visitas e follow-ups |
| US33 | Vendedor | Marcar um agendamento como realizado | Registrar o cumprimento da atividade |
| US34 | Vendedor | Configurar repetição mensal de um agendamento | Automatizar compromissos recorrentes |
| US35 | Usuário | Visualizar agendamentos por data | Organizar a agenda da equipe |

---

## 🔒 Observações

- Esta é uma **versão de demonstração acadêmica**, com expiração em **10/07/2026**
- Após a data de expiração, o sistema exibirá uma tela de encerramento e a API retornará erro `403`
- Os dados são armazenados localmente em `back/prisma/dev.db` (SQLite)
- Para uso em produção, recomenda-se migrar para PostgreSQL e alterar o `JWT_SECRET` no `.env`
