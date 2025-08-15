import type ICartaPokemon = require("../interface/ICartaPokemon");

export class CartaPokemon implements ICartaPokemon.ICartaPokemon {
  idCarta: string;
  nomePokemon: string;
  tipo: string;
  hp: number;
  ataque: number;

  constructor(idCarta: string, nomePokemon: string, tipo: string, hp: number, ataque: number) {
    this.idCarta = idCarta;
    this.nomePokemon = nomePokemon;
    this.tipo = tipo;
    this.hp = hp;
    this.ataque = ataque;
  }

  public exibirDetalhes(): void {
    console.log(`
      --- Detalhes da Carta ---
      ID: ${this.idCarta}
      Nome: ${this.nomePokemon}
      Tipo: ${this.tipo}
      HP: ${this.hp}
      Ataque: ${this.ataque}
      -------------------------
    `);
  }
}



