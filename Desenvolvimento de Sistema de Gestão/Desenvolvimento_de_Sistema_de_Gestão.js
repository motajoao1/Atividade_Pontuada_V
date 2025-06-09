const readline = require('readline/promises');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Inicia vazio.
const livros = [];

/**
 Cadastra um novo livro no sistema.
 Solicita ao usuário o título e o autor do livro.
 */
async function cadastrarLivro() {
    console.log("\n--- Cadastro de Novo Livro ---");
    const titulo = await rl.question("Digite o título do livro: ");
    const autor = await rl.question("Digite o autor do livro: ");

    if (titulo && autor) {
        // Cria um novo objeto de livro com um ID único
        const novoLivro = {
            id: livros.length > 0 ? Math.max(...livros.map(livro => livro.id)) + 1 : 1,
            titulo: titulo,
            autor: autor,
            disponivel: true // Novos livros são sempre cadastrados como disponíveis
        };

        livros.push(novoLivro);
        console.log(`\n O livro "${titulo}" foi cadastrado com sucesso!`);
    } else {
        console.log("\n Título e autor são obrigatórios. Tente novamente.");
    }
}

/**
 Lista todos os livros cadastrados na biblioteca.
 Exibe as informações de cada livro diretamente no terminal.
 */
function listarLivros() {
    console.log("\n--- Lista de Todos os Livros ---");

    if (livros.length === 0) {
        console.log("Nenhum livro cadastrado ainda. Use a opção 1 para começar.");
        return;
    }
    
    // Organiza a saída em formato de tabela
    console.log("ID | Título                | Autor                 | Status");
    console.log("----------------------------------------------------------------");
    livros.forEach(livro => {
        const status = livro.disponivel ? "Disponível" : "Emprestado";
        // Usa padEnd para alinhar o texto, criando colunas
        console.log(
            `${livro.id.toString().padEnd(3)}| ${livro.titulo.padEnd(22)}| ${livro.autor.padEnd(22)}| ${status}`
        );
    });
}

/**
 Busca um livro pelo título.
 */
async function buscarLivro() {
    console.log("\n--- Busca de Livro por Título ---");
    
    if (livros.length === 0) {
        console.log("Nenhum livro cadastrado para buscar.");
        return;
    }

    const termoBusca = await rl.question("Digite o título ou parte do título para buscar: ");

    if (!termoBusca) {
        console.log("\n Por favor, digite um termo para a busca.");
        return;
    }

    const resultados = livros.filter(livro => 
        livro.titulo.toLowerCase().includes(termoBusca.toLowerCase())
    );

    console.log(`\n--- Resultados da busca por "${termoBusca}" ---`);

    if (resultados.length > 0) {
        resultados.forEach(livro => {
            const status = livro.disponivel ? "Disponível" : "Emprestado";
            console.log(` > ID: ${livro.id} | Título: ${livro.titulo} | Autor: ${livro.autor} | Status: ${status}`);
        });
    } else {
        console.log("Nenhum livro encontrado com este título.");
    }
}

/**
 Altera o status de um livro (emprestar ou devolver).
 Solicita o ID do livro e inverte seu status de disponibilidade.
 */
async function alterarStatusLivro() {
    console.log("\n--- Emprestar/Devolver Livro ---");

    if (livros.length === 0) {
        console.log("Nenhum livro cadastrado para emprestar ou devolver.");
        return;
    }

    const idInput = await rl.question("Digite o ID do livro para alterar o status: ");
    const idLivro = parseInt(idInput);

    if (isNaN(idLivro)) {
        console.log("\n ID inválido. Por favor, digite um número.");
        return;
    }
    
    const livro = livros.find(livro => livro.id === idLivro);

    if (livro) {
        // Inverte o valor booleano da disponibilidade
        livro.disponivel = !livro.disponivel; 
        const novoStatus = livro.disponivel ? "devolvido" : "emprestado";
        console.log(`\n O livro "${livro.titulo}" foi ${novoStatus} com sucesso!`);
    } else {
        console.log("\n Livro não encontrado com o ID informado.");
    }
}

/**
 Exibe o menu principal de opções para o usuário.
 */
function exibirMenu() {
    console.log(`
==================================
  📚 Sistema de Gestão de Biblioteca 📚
==================================
Escolha uma opção:
1. Cadastrar Novo Livro
2. Listar Todos os Livros
3. Buscar Livro por Título
4. Emprestar/Devolver Livro
5. Sair
==================================
    `);
}

/**
 Função principal que inicia e gerencia o sistema em um loop.
 */
async function iniciarSistema() {
    let rodando = true;

    while (rodando) {
        exibirMenu();
        const opcao = await rl.question("Digite o número da opção desejada: ");

        switch (opcao) {
            case '1':
                await cadastrarLivro();
                break;
            case '2':
                listarLivros();
                break;
            case '3':
                await buscarLivro();
                break;
            case '4':
                await alterarStatusLivro();
                break;
            case '5':
                rodando = false;
                console.log("\nSaindo do sistema. Até logo!");
                break;
            default:
                console.log("\n Opção inválida! Por favor, escolha um número de 1 a 5.");
        }
        if (rodando) {
            await rl.question("\nPressione ENTER para continuar...");
        }
    }

    // Fecha a interface de leitura do terminal
    rl.close();
}

// Inicia a execução do sistema
iniciarSistema();