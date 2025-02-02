import { Card } from "./Card";

type Hand = Card[];

export class PlayerHand {
  private hands: Hand[] = [];

  public constructor() {
    this.hands = [[]];
  }

  public addCard(card: Card, handNumber: number): void {
    this.hands[handNumber].push(card);
  }

  public getSum(handNumber: number): number {
    let sum = 0;
    let aceCount = 0;
    for (let i = 0; i < this.hands[handNumber].length; i++) {
      if (this.hands[handNumber][i].getValue() === 1) {
        aceCount++;
      }
      sum += this.hands[handNumber][i].getValue();
    }
    while (sum <= 11 && aceCount > 0) {
      sum += 10;
      aceCount--;
    }
    return sum;
  }
}
