import { Card, Deck } from "./Card";

export class CardDistributor {
  private deck: Deck;
  private cutOff: number;
  private currentIndex: number = 0;

  constructor(cutOff: number, numberOfDecks: number) {
    this.deck = this.createDeck(numberOfDecks);
    this.cutOff = cutOff;
  }

  // Create a standard deck of 52 cards
  private createDeck(numberOfDecks: number): Deck {
    const deck: Deck = [];
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    for (let numOfDeck = 0; numOfDeck < numberOfDecks; numOfDeck++) {
      for (const suit of suits) {
        for (let rank = 1; rank <= 13; rank++) {
          deck.push(new Card(rank));
        }
      }
    }
    return deck;
  }
}
