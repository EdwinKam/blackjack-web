import { Card } from "./Card";

type Hand = Card[];

export class PlayerHand {
  private hands: Hand[] = [];
  public baseBetRatio: number[] = [1];

  public constructor() {
    this.hands = [[]];
  }

  public hitCard(card: Card, handNumber: number): void {
    this.hands[handNumber].push(card);
  }

  public doubleCard(card: Card, handNumber: number): void {
    this.baseBetRatio[handNumber] = 2;
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

  public isBlackjack(handNumber: number): boolean {
    return (
      this.hands[handNumber].length === 2 && this.getSum(handNumber) === 21
    );
  }

  public hasPair(handNumber: number): boolean {
    return (
      this.hands[handNumber].length === 2 &&
      this.hands[handNumber][0].getValue() ===
        this.hands[handNumber][1].getValue()
    );
  }

  public hasAce(handNumber: number): boolean {
    return this.hands[handNumber].some((card) => card.getValue() === 1);
  }

  public getPairCard(handNumber: number): Card {
    return this.hands[handNumber][0];
  }

  public getValueWithoutAce(handNumber: number): number {
    if (this.hasAce(handNumber)) {
      let sum = 0;
      for (let i = 0; i < this.hands[handNumber].length; i++) {
        sum += this.hands[handNumber][i].getValue();
      }
      return sum;
    } else {
      return 0;
    }
  }

  public splitHand(handNumber: number): void {
    const card = this.hands[handNumber].pop() as Card;
    this.hands.push([card]);
    this.baseBetRatio.push(1);
  }

  public getHandsCount(): number {
    return this.hands.length;
  }

  public toString(): string {
    return (
      this.hands
        .map((hand) => hand.map((card) => card.toString()).join(", "))
        .join(" | ") + ` (${this.getSum(0)})`
    );
  }

  public getBaseBetRatio(handNumber: number): number {
    return this.baseBetRatio[handNumber];
  }

  public onlyHasOneCard(handNumber: number): boolean {
    return this.hands[handNumber].length === 1;
  }
}
