const gRPC = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Carrega o .proto
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, 'proto', 'product.proto'),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);

const productProto = gRPC.loadPackageDefinition(packageDefinition).product;

// Conecta ao servidor
const client = new productProto.ProductService(
  'localhost:50051',
  gRPC.credentials.createInsecure()
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function listarProdutos() {
  try {
    const data = fs.readFileSync('products.json', 'utf8');
    const { products } = JSON.parse(data);
    console.log('\n=== Lista de Produtos ===');
    if (products.length === 0) {
      console.log('Nenhum produto cadastrado.');
    } else {
      products.forEach(produto => {
        console.log(`ID: ${produto.id}`);
        console.log(`Nome: ${produto.name}`);
        console.log(`Preço: R$ ${produto.price.toFixed(2)}`);
        console.log(`Disponível: ${produto.available ? 'Sim' : 'Não'}`);
        console.log('------------------------');
      });
    }
  } catch (error) {
    console.error('Erro ao listar produtos:', error.message);
  }
  menu();
}

function criarProduto() {
  rl.question('ID do produto: ', (id) => {
    rl.question('Nome do produto: ', (nome) => {
      rl.question('Preço do produto: ', (preco) => {
        rl.question('Disponível (F - Falso/ V - Verdadeiro): ', (disponivel) => {
          if (disponivel.toLowerCase() === 'f') {
            disponivel = false;
          } else {
            disponivel = true;
          }
          const produto = {
            id: parseInt(id),
            name: nome,
            price: parseFloat(preco),
            available: disponivel
          };

          client.CreateProduct(produto, (err, res) => {
            if (err) {
              console.error('Erro ao criar produto:', err.message);
            } else {
              console.log('Produto criado com sucesso:', res);
            }
            menu();
          });
        });
      });
    });
  });
}

function buscarProduto() {
  rl.question('Digite o ID do produto: ', (id) => {
    client.GetProduct({ id: parseInt(id) }, (err, res) => {
      if (err) {
        console.error('Erro ao buscar produto:', err.message);
      } else {
        console.log('Produto encontrado:', res);
      }
      menu();
    });
  });
}

function menu() {
  console.log('\n=== Sistema de Produtos ===');
  console.log('1. Listar todos os produtos');
  console.log('2. Criar novo produto');
  console.log('3. Buscar produto por ID');
  console.log('0. Sair');
  
  rl.question('\nEscolha uma opção: ', (opcao) => {
    switch(opcao) {
      case '1':
        listarProdutos();
        break;
      case '2':
        criarProduto();
        break;
      case '3':
        buscarProduto();
        break;
      case '0':
        console.log('Saindo do sistema...');
        rl.close();
        break;
      default:
        console.log('Opção inválida!');
        menu();
    }
  });
}

// Inicia o menu
menu();


