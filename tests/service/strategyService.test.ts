import { getPlayAction } from "../../src/service/strategyService";
import { PlayerHand } from "../../src/model/PlayerHand";
import { DealerHand } from "../../src/model/DealerHand";
import { Card } from "../../src/model/Card";
import { BlackjackAction } from "../../src/model/BlackjackAction";

describe("getPlayAction", () => {
  let playerHand: PlayerHand;
  let dealerHand: DealerHand;

  beforeEach(() => {
    playerHand = new PlayerHand();
    dealerHand = new DealerHand();
  });

  it("should return Stand for a player blackjack", () => {
    playerHand.hitCard(new Card(1), 0); // Ace
    playerHand.hitCard(new Card(10), 0); // 10
    dealerHand.addCard(new Card(5)); // Dealer's face-up card

    const action = getPlayAction(playerHand, dealerHand, 0);
    expect(action).toBe(BlackjackAction.Stand);
  });

  it("should return Hit for player sum 8 against dealer 10", () => {
    playerHand.hitCard(new Card(5), 0);
    playerHand.hitCard(new Card(3), 0);
    dealerHand.addCard(new Card(10)); // Dealer's face-up card

    const action = getPlayAction(playerHand, dealerHand, 0);
    expect(action).toBe(BlackjackAction.Hit);
  });

  it("should return Double for player sum 11 against dealer 6", () => {
    playerHand.hitCard(new Card(6), 0);
    playerHand.hitCard(new Card(5), 0);
    dealerHand.addCard(new Card(6)); // Dealer's face-up card

    const action = getPlayAction(playerHand, dealerHand, 0);
    expect(action).toBe(BlackjackAction.Double);
  });

  it("should return Split for pair of 8s against dealer 5", () => {
    playerHand.hitCard(new Card(8), 0);
    playerHand.hitCard(new Card(8), 0);
    dealerHand.addCard(new Card(5)); // Dealer's face-up card

    const action = getPlayAction(playerHand, dealerHand, 0);
    expect(action).toBe(BlackjackAction.Split);
  });

  it("should return Stand for soft 18 against dealer 2", () => {
    playerHand.hitCard(new Card(1), 0); // Ace
    playerHand.hitCard(new Card(7), 0);
    dealerHand.addCard(new Card(2)); // Dealer's face-up card

    const action = getPlayAction(playerHand, dealerHand, 0);
    expect(action).toBe(BlackjackAction.Stand);
  });
});

describe("getPlayAction - Edge Cases", () => {
  let playerHand: PlayerHand;
  let dealerHand: DealerHand;

  beforeEach(() => {
    playerHand = new PlayerHand();
    dealerHand = new DealerHand();
  });

  it("should handle a hand with more than two cards", () => {
    playerHand.hitCard(new Card(2), 0);
    playerHand.hitCard(new Card(3), 0);
    playerHand.hitCard(new Card(4), 0);
    playerHand.hitCard(new Card(5), 0);
    dealerHand.addCard(new Card(10)); // Dealer's face-up card

    const action = getPlayAction(playerHand, dealerHand, 0);
    expect(action).toBe(BlackjackAction.Hit); // Assuming strategy for sum 14 against 10 is Hit
  });

  it("should handle split hands correctly", () => {
    playerHand.hitCard(new Card(8), 0);
    playerHand.hitCard(new Card(8), 0);
    dealerHand.addCard(new Card(5)); // Dealer's face-up card

    const action1 = getPlayAction(playerHand, dealerHand, 0);

    expect(action1).toBe(BlackjackAction.Split);
  });

  it("should not go out of bounds when accessing hand numbers", () => {
    playerHand.hitCard(new Card(10), 0);
    playerHand.hitCard(new Card(10), 0);
    dealerHand.addCard(new Card(6)); // Dealer's face-up card

    // Attempt to access a non-existent hand
    expect(() => getPlayAction(playerHand, dealerHand, 1)).toThrowError();
  });

  it("should handle a hand with multiple Aces correctly", () => {
    playerHand.hitCard(new Card(1), 0); // Ace
    playerHand.hitCard(new Card(1), 0); // Ace
    playerHand.hitCard(new Card(9), 0);
    dealerHand.addCard(new Card(7)); // Dealer's face-up card

    const action = getPlayAction(playerHand, dealerHand, 0);
    expect(action).toBe(BlackjackAction.Stand); // Assuming strategy for soft 21 is Stand
  });

  it("should handle a hand with a bust scenario", () => {
    playerHand.hitCard(new Card(11), 0);
    playerHand.hitCard(new Card(11), 0);
    playerHand.hitCard(new Card(5), 0);
    dealerHand.addCard(new Card(6)); // Dealer's face-up card

    const action = getPlayAction(playerHand, dealerHand, 0);
    expect(action).toBe(BlackjackAction.Stand); // Assuming strategy for bust is Stand
  });
});
