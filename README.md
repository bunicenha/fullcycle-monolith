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
