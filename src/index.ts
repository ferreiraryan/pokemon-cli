import * as readline from 'readline/promises';
import { v4 as uuidv4 } from 'uuid';
import { GerenciadorDeCartas } from './managers/GerenciadorDeCartas';
import { CartaPokemon } from './models/CartaPokemon';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const gerenciador = new GerenciadorDeCartas();

async function main() {
  while (true) {
    console.log(`
    ===== Gerenciador de Cartas Pokémon =====
    1. Adicionar Carta
    2. Listar Todas as Cartas
    3. Editar Carta
    4. Deletar Carta
    5. Iniciar Luta
    6. Sair
    =========================================
    `);

    const opcao = await rl.question('Escolha uma opção: ');

    switch (opcao) {
      case '1':
        const nome = await rl.question('Nome do Pokémon: ');
        const tipo = await rl.question('Tipo: ');
        const hp = parseInt(await rl.question('HP: '), 10);
        const ataque = parseInt(await rl.question('Ataque: '), 10);
        const novoId = gerenciador.gerarNovoId();
        const novaCarta = new CartaPokemon(novoId, nome, tipo, hp, ataque);
        await gerenciador.adicionarCarta(novaCarta);
        break;
      case '2':
        gerenciador.listarTodasAsCartas();
        break;
      case '3':
        const idEditar = await rl.question('ID da carta para editar: ');
        console.log('Deixe em branco os campos que não deseja alterar.');
        const novoNome = await rl.question('Novo nome: ');
        const novoTipo = await rl.question('Novo tipo: ');
        const novoHpStr = await rl.question('Novo HP: ');
        const novoAtaqueStr = await rl.question('Novo Ataque: ');

        const novosDados: any = {};
        if (novoNome) novosDados.nomePokemon = novoNome;
        if (novoTipo) novosDados.tipo = novoTipo;
        if (novoHpStr) novosDados.hp = parseInt(novoHpStr, 10);
        if (novoAtaqueStr) novosDados.ataque = parseInt(novoAtaqueStr, 10);

        if (Object.keys(novosDados).length > 0) {
          await gerenciador.editarCarta(idEditar, novosDados);
        } else {
          console.log("Nenhuma alteração fornecida.");
        }
        break;
      case '4':
        const idDeletar = await rl.question('ID da carta para deletar: ');
        await gerenciador.deletarCarta(idDeletar);
        break;
      case '5':
        const idLutador1 = await rl.question('ID da primeira carta (lutador 1): ');
        const idLutador2 = await rl.question('ID da segunda carta (lutador 2): ');
        await gerenciador.iniciarLuta(idLutador1, idLutador2);
        break;
      case '6':
        console.log('Saindo...');
        rl.close();
        return;
      default:
        console.log('Opção inválida.');
    }
  }
}

main();
