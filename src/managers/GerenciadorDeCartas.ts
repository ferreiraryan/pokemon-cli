import { promises as fs } from 'fs';
import * as path from 'path';
import { CartaPokemon } from '../models/CartaPokemon';

export class GerenciadorDeCartas {
  private cartas: CartaPokemon[] = [];
  private readonly dbPath = path.resolve(__dirname, '../../database/cartas.json');

  constructor() {
    this.carregarCartas().catch(error => console.error("Erro ao carregar cartas:", error));
  }

  public gerarNovoId(): string {
    if (this.cartas.length === 0) {
      return '1';
    }
    const maiorId = Math.max(...this.cartas.map(c => parseInt(c.idCarta, 10)));
    return (maiorId + 1).toString();
  }

  private async carregarCartas(): Promise<void> {
    try {
      const data = await fs.readFile(this.dbPath, 'utf-8');
      const cartasSalvas = JSON.parse(data);
      this.cartas = cartasSalvas.map((carta: any) =>
        new CartaPokemon(carta.idCarta, carta.nomePokemon, carta.tipo, carta.hp, carta.ataque)
      );
    } catch (error) {
      this.cartas = [];
    }
  }

  private async salvarCartas(): Promise<void> {
    await fs.mkdir(path.dirname(this.dbPath), { recursive: true });
    await fs.writeFile(this.dbPath, JSON.stringify(this.cartas, null, 2));
  }

  public async adicionarCarta(carta: CartaPokemon): Promise<void> {
    if (this.cartas.some(c => c.idCarta === carta.idCarta)) {
      console.log('Erro: Já existe uma carta com este ID.');
      return;
    }
    this.cartas.push(carta);
    await this.salvarCartas();
    console.log(`Carta '${carta.nomePokemon}' adicionada com sucesso!`);
  }

  public listarTodasAsCartas(): void {
    if (this.cartas.length === 0) {
      console.log('Nenhuma carta cadastrada.');
      return;
    }
    console.log('--- Lista de Todas as Cartas ---');
    this.cartas.forEach(carta => carta.exibirDetalhes());
  }

  public async editarCarta(idCarta: string, novosDados: Partial<Omit<CartaPokemon, 'idCarta'>>): Promise<void> {
    const index = this.cartas.findIndex(c => c.idCarta === idCarta);
    if (index === -1) {
      console.log('Carta não encontrada.');
      return;
    }

    Object.assign(this.cartas[index], novosDados);

    await this.salvarCartas();
    console.log(`Carta '${this.cartas[index].nomePokemon}' editada com sucesso!`);
  }

  public async deletarCarta(idCarta: string): Promise<void> {
    const tamanhoInicial = this.cartas.length;
    this.cartas = this.cartas.filter(c => c.idCarta !== idCarta);

    if (this.cartas.length < tamanhoInicial) {
      await this.salvarCartas();
      console.log('Carta deletada com sucesso!');
    } else {
      console.log('Carta não encontrada.');
    }
  }

  public async iniciarLuta(idCarta1: string, idCarta2: string): Promise<void> {
    const pokemon1 = this.cartas.find(c => c.idCarta === idCarta1);
    const pokemon2 = this.cartas.find(c => c.idCarta === idCarta2);

    if (!pokemon1 || !pokemon2) {
      console.log('Uma ou ambas as cartas não foram encontradas. Verifique os IDs.');
      return;
    }

    console.log(`--- INÍCIO DA LUTA: ${pokemon1.nomePokemon} vs ${pokemon2.nomePokemon} ---`);
    pokemon1.exibirDetalhes();
    pokemon2.exibirDetalhes();

    let vencedor: CartaPokemon | null = null;
    let perdedor: CartaPokemon | null = null;

    if (pokemon1.ataque > pokemon2.ataque) {
      vencedor = pokemon1;
      perdedor = pokemon2;
    } else if (pokemon2.ataque > pokemon1.ataque) {
      vencedor = pokemon2;
      perdedor = pokemon1;
    } else {
      console.log("A luta terminou em empate, pois ambos têm o mesmo poder de ataque!");
      return;
    }

    const danoCausado = vencedor.ataque - (perdedor.ataque / 2);
    perdedor.hp -= danoCausado > 0 ? danoCausado : 0;

    console.log(`\n${vencedor.nomePokemon} ataca ${perdedor.nomePokemon}!`);
    console.log(`O vencedor da luta é: ${vencedor.nomePokemon}!`);
    console.log(`-------------------------------------------------`);
  }
}
