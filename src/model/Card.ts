export class Card {
  private rank: number;

  constructor(rank: number) {
    this.rank = rank;
  }

  public toString(): string {
    switch (this.rank) {
      case 1:
        return "A";
      case 11:
        return "J";
      case 12:
        return "Q";
      case 13:
        return "K";
      default:
        return this.rank.toString();
    }
  }

  public getValue(): number {
    switch (this.rank) {
      case 11:
      case 12:
      case 13:
        return 10;
      default:
        return this.rank;
    }
  }
}

// Define a type for a deck of cards
export type Deck = Card[];
