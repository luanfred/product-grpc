# Sistema de Produtos gRPC

Este é um sistema de gerenciamento de produtos utilizando gRPC, uma tecnologia moderna de comunicação entre serviços.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript
- **gRPC**: Framework de comunicação RPC (Remote Procedure Call)
- **Protocol Buffers**: Formato de serialização de dados usado pelo gRPC

## Pré-requisitos

- Node.js instalado (versão 14 ou superior)
- NPM (Node Package Manager)

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## Estrutura do Projeto

- `proto/`: Contém as definições dos serviços gRPC
- `server.js`: Implementação do servidor gRPC
- `client.js`: Cliente para testar os serviços
- `products.json`: Arquivo de dados dos produtos

## Como Executar

1. Inicie o servidor:
```bash
node server.js
```

2. Em outro terminal, execute o cliente:
```bash
node client.js
```

## Funcionalidades

O sistema oferece as seguintes operações:
- Listar produtos
- Buscar produto por ID
- Criar novo produto
- Atualizar produto existente
- Remover produto

## Dependências Principais

- @grpc/grpc-js: Implementação do gRPC para Node.js
- @grpc/proto-loader: Carregador de arquivos .proto

## Observações

- O servidor gRPC roda por padrão na porta 50051
- Os dados dos produtos são armazenados em um arquivo JSON local 