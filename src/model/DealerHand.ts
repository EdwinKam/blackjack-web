import { Card } from "./Card";
import { CardDistributor } from "./CardDistributor";

export class DealerHand {
  private hand: Card[];

  public constructor() {
    this.hand = [];
  }

  public addCard(card: Card): void {
    this.hand.push(card);
  }

  public getFaceUpCard(): Card {
    return this.hand[0];
  }

  public addCardUntil17(cardDistributor: CardDistributor): void {
    while (this.getSum() < 17 || this.isSoft17()) {
      this.addCard(cardDistributor.dealCard());
    }
  }

  public isSoft17(): boolean {
    return this.hasAce() && this.getValueWithoutAce() === 6;
  }

  public hasAce(): boolean {
    return this.hand.some((card) => card.getValue() === 1);
  }

  public getValueWithoutAce(): number {
    if (this.hasAce()) {
      let sum = 0;
      for (let i = 0; i < this.hand.length; i++) {
        sum += this.hand[i].getValue();
      }
      return sum - 1;
    } else {
      return 0;
    }
  }

  public getSum(): number {
    let sum = 0;
    let aceCount = 0;
    for (let i = 0; i < this.hand.length; i++) {
      if (this.hand[i].getValue() === 1) {
        aceCount++;
      }
      sum += this.hand[i].getValue();
    }
    while (sum <= 11 && aceCount > 0) {
      sum += 10;
      aceCount--;
    }
    return sum;
  }

  public isBlackjack(): boolean {
    return this.hand.length === 2 && this.getSum() === 21;
  }

  public toString(): string {
    return (
      "dealer: " +
      this.hand.map((card) => card.toString()).join(", ") +
      ` (${this.getSum()})`
    );
  }
}
