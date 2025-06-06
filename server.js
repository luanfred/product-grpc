const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
const path = require('path');

const packageDefinition = protoLoader.loadSync('./proto/product.proto');
const productProto = grpc.loadPackageDefinition(packageDefinition).product;

// Função para ler produtos do arquivo JSON
function readProducts() {
    try {
        const data = fs.readFileSync('products.json', 'utf8');
        return JSON.parse(data).products;
    } catch (error) {
        console.error('Erro ao ler arquivo de produtos:', error);
        return [];
    }
}

// Função para salvar produtos no arquivo JSON
function saveProducts(products) {
    try {
        const jsonData = JSON.stringify({ products }, null, 4);
        fs.writeFileSync('products.json', jsonData);
        console.log('Produtos salvos:', jsonData); // Debug
    } catch (error) {
        console.error('Erro ao salvar produtos:', error);
    }
}


function CreateProduct(call, callback) {
    console.log('Criando novo produto:', call.request);
    const products = readProducts();
    
    // Verifica se já existe um produto com o mesmo ID
    if (products.some(p => p.id === call.request.id)) {
        callback({
            code: grpc.status.ALREADY_EXISTS,
            message: 'Já existe um produto com este ID'
        });
        return;
    }

    const newProduct = {
        id: call.request.id,
        name: call.request.name,
        price: call.request.price,
        available: call.request.available
    };

    console.log('Novo produto a ser adicionado:', newProduct);
    products.push(newProduct);
    saveProducts(products);
    console.log('Produto criado com sucesso:', newProduct);
    callback(null, newProduct);
}

function GetProduct(call, callback) {
    console.log('Buscando produto com ID:', call.request.id);
    const products = readProducts();
    const product = products.find(u => u.id === call.request.id);
    
    if (product) {
        console.log('Produto encontrado:', product);
        callback(null, product);
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            message: 'Produto não encontrado'
        });
    }
}

const server = new grpc.Server();
server.addService(
    productProto.ProductService.service, 
    { CreateProduct, GetProduct }
);

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Servidor gRPC rodando na porta 50051');
  server.start();
});
