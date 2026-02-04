# FullCycle Monolith

Aplicação monolítica desenvolvida com arquitetura de domínio (DDD - Domain-Driven Design), utilizando TypeScript, Express e Sequelize.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 14 ou superior)
- **npm** (versão 6 ou superior) ou **yarn**
- **Git**

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd fullcycle-monolith
```

2. Instale as dependências:
```bash
npm install
```

## 🖥️ Executando a Aplicação

### Modo Produção

```bash
npm start
```

### Modo Desenvolvimento (com hot reload)

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📚 API Documentation (Swagger)

Acesse a documentação da API em: `http://localhost:3000/api-docs`

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/products` | Criar um novo produto |
| POST | `/clients` | Criar um novo cliente |
| POST | `/checkout` | Realizar um pedido (place order) |
| GET | `/invoice/:id` | Buscar uma invoice pelo ID |

### Exemplos de Requisições

#### POST /products
```json
{
  "id": "1",
  "name": "Product 1",
  "description": "Product description",
  "purchasePrice": 100,
  "salesPrice": 150,
  "stock": 10
}
```

#### POST /clients
```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@email.com",
  "document": "123.456.789-00",
  "address": {
    "street": "Main Street",
    "number": "100",
    "complement": "Apt 1",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01001-000"
  }
}
```

#### POST /checkout
```json
{
  "clientId": "1",
  "products": [
    { "productId": "1" }
  ]
}
```

#### GET /invoice/:id
```
GET /invoice/abc-123-def-456
```

## 🧪 Executando os Testes

O projeto utiliza Jest como framework de testes com SWC para transformação rápida do código TypeScript.

### Executar todos os testes

```bash
npm test
```

Este comando irá:
- Verificar a compilação TypeScript (`tsc --noEmit`)
- Executar todos os testes unitários com Jest

### Executar testes em modo watch

Para executar os testes em modo watch (re-executa automaticamente quando arquivos são alterados):

```bash
npm test -- --watch
```

### Executar testes de um módulo específico

Para executar testes de um módulo específico, você pode usar o padrão de busca do Jest:

```bash
npm test -- client-adm
npm test -- invoice
npm test -- payment
npm test -- product-adm
npm test -- store-catalog
```

### Executar um arquivo de teste específico

```bash
npm test -- add-client.usecase.spec.ts
```

## 🏗️ Arquitetura

O projeto segue os princípios de Domain-Driven Design (DDD) e Clean Architecture:

```
src/
├── application/          # Camada de aplicação (API REST)
│   ├── database/         # Configuração do banco de dados
│   ├── routes/           # Rotas da API
│   ├── app.ts            # Configuração do Express
│   └── server.ts         # Entry point da aplicação
│
└── modules/              # Módulos de domínio
    ├── @shared/          # Componentes compartilhados
    ├── checkout/         # Módulo de checkout (place order)
    ├── client-adm/       # Módulo de administração de clientes
    ├── invoice/          # Módulo de invoices
    ├── payment/          # Módulo de pagamentos
    ├── product-adm/      # Módulo de administração de produtos
    └── store-catalog/    # Módulo de catálogo de produtos
```

Cada módulo segue a estrutura:
- `domain/` - Entidades e regras de negócio
- `gateway/` - Interfaces de repositório (portas)
- `repository/` - Implementações de repositório (adaptadores)
- `usecase/` - Casos de uso (camada de aplicação)
- `facade/` - API pública do módulo
- `factory/` - Fábricas para criação de facades
