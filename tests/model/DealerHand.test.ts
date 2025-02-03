import { Card } from "../../src/model/Card";
import { DealerHand } from "../../src/model/DealerHand";

describe("Dealer Hand test", () => {
  let dealerHand: DealerHand;

  beforeEach(() => {
    dealerHand = new DealerHand();
  });

  it("check dealer blackjack sum", () => {
    dealerHand.addCard(new Card(1)); // Ace
    dealerHand.addCard(new Card(10)); // 10

    const sum = dealerHand.getSum();
    expect(sum).toBe(21);
  });

  it("check dealer blackjack", () => {
    dealerHand.addCard(new Card(1)); // Ace
    dealerHand.addCard(new Card(10)); // 10

    expect(true).toBe(dealerHand.isBlackjack());
  });

  it("check dealer 21 but not blackjack", () => {
    dealerHand.addCard(new Card(5));
    dealerHand.addCard(new Card(10));
    dealerHand.addCard(new Card(6));

    expect(false).toBe(dealerHand.isBlackjack());
  });

  it("check dealer 21 3 card", () => {
    dealerHand.addCard(new Card(5));
    dealerHand.addCard(new Card(10));
    dealerHand.addCard(new Card(6));

    expect(21).toBe(dealerHand.getSum());
  });

  it("check dealer soft17 3 card", () => {
    dealerHand.addCard(new Card(1));
    dealerHand.addCard(new Card(3));
    dealerHand.addCard(new Card(3));

    expect(true).toBe(dealerHand.isSoft17());
  });

  it("check dealer soft17 2 card", () => {
    dealerHand.addCard(new Card(1));
    dealerHand.addCard(new Card(6));

    expect(true).toBe(dealerHand.isSoft17());
  });

  it("check dealer soft17 3 card", () => {
    dealerHand.addCard(new Card(1));
    dealerHand.addCard(new Card(2));
    dealerHand.addCard(new Card(4));

    expect(true).toBe(dealerHand.isSoft17());
  });

  it("check dealer 17 but have ace", () => {
    dealerHand.addCard(new Card(1));
    dealerHand.addCard(new Card(6));
    dealerHand.addCard(new Card(10));

    expect(false).toBe(dealerHand.isSoft17());
  });

  it("check dealer 17 but no ace", () => {
    dealerHand.addCard(new Card(2));
    dealerHand.addCard(new Card(5));
    dealerHand.addCard(new Card(10));

    expect(false).toBe(dealerHand.isSoft17());
  });
});
