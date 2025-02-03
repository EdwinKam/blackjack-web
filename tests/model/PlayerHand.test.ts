import { Card } from "../../src/model/Card";
import { PlayerHand } from "../../src/model/PlayerHand";

describe("Player Hand test", () => {
  let playerHand: PlayerHand;

  beforeEach(() => {
    playerHand = new PlayerHand();
  });

  it("check SumWithoutAce 10", () => {
    playerHand.hitCard(new Card(1), 0); // Ace
    playerHand.hitCard(new Card(10), 0); // 10

    const sumWithoutAce = playerHand.getValueWithoutAce(0);
    expect(sumWithoutAce).toBe(10);
  });

  it("check SumWithoutAce 11", () => {
    playerHand.hitCard(new Card(1), 0); // Ace
    playerHand.hitCard(new Card(11), 0); // 10

    const sumWithoutAce = playerHand.getValueWithoutAce(0);
    expect(sumWithoutAce).toBe(10);
  });

  it("check sum hard", () => {
    playerHand.hitCard(new Card(2), 0); // Ace
    playerHand.hitCard(new Card(11), 0); // 10

    const sumWithoutAce = playerHand.getSum(0);
    expect(sumWithoutAce).toBe(12);
  });

  it("check sum blackjack", () => {
    playerHand.hitCard(new Card(1), 0); // Ace
    playerHand.hitCard(new Card(11), 0); // 10

    const sumWithoutAce = playerHand.getSum(0);
    expect(sumWithoutAce).toBe(21);
  });

  it("check sum has ace", () => {
    playerHand.hitCard(new Card(1), 0); // Ace
    playerHand.hitCard(new Card(5), 0);
    playerHand.hitCard(new Card(4), 0);

    const sumWithoutAce = playerHand.getSum(0);
    expect(sumWithoutAce).toBe(20);
  });
});
