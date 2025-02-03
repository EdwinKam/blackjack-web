import { BlackjackAction } from "./BlackjackAction";
import { DealerHand } from "./DealerHand";
import { PlayerHand } from "./PlayerHand";

export const defaultBlackjackStrategy: string[][] = [
  // 2,   3,   4,   5,   6,   7,   8,   9,  10,  A
  ["H", "H", "D", "D", "H", "H", "H", "H", "H", "H"], // Player sum 8
  ["D", "D", "D", "D", "D", "H", "H", "H", "H", "H"], // Player sum 9
  ["D", "D", "D", "D", "D", "D", "D", "H", "H", "H"], // Player sum 10
  ["D", "D", "D", "D", "D", "D", "D", "D", "H", "H"], // Player sum 11
  ["H", "H", "S", "S", "S", "H", "H", "H", "H", "H"], // Player sum 12
  ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"], // Player sum 13
  ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"], // Player sum 14
  ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"], // Player sum 15
  ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"], // Player sum 16
  ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"], // Player sum 17
];

export const defaultSoftHandStrategy: string[][] = [
  // 2,  3,  4,  5,   6,  7,   8,   9,  10,  A
  ["H", "H", "H", "D", "D", "H", "H", "H", "H", "H"], // Player soft 13 (A, 2)
  ["H", "H", "H", "D", "D", "H", "H", "H", "H", "H"], // Player soft 14 (A, 3)
  ["H", "H", "D", "D", "D", "H", "H", "H", "H", "H"], // Player soft 15 (A, 4)
  ["H", "H", "D", "D", "D", "H", "H", "H", "H", "H"], // Player soft 16 (A, 5)
  ["H", "D", "D", "D", "D", "H", "H", "H", "H", "H"], // Player soft 17 (A, 6)
  ["S", "D", "D", "D", "D", "S", "S", "H", "H", "H"], // Player soft 18 (A, 7)
  ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"], // Player soft 19 (A, 8)
  ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"], // Player soft 20 (A, 9)
];

export const defaultPairStrategy: string[][] = [
  // 2, 3, 4, 5, 6, 7, 8, 9, 10,  A
  ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"], // Pair of Aces
  ["P", "P", "P", "P", "P", "P", "H", "H", "H", "H"], // Pair of 2s
  ["P", "P", "P", "P", "P", "P", "H", "H", "H", "H"], // Pair of 3s
  ["H", "H", "H", "P", "P", "H", "H", "H", "H", "H"], // Pair of 4s
  ["D", "D", "D", "D", "D", "D", "H", "H", "H", "H"], // Pair of 5s
  ["P", "P", "P", "P", "P", "H", "H", "H", "H", "H"], // Pair of 6s
  ["P", "P", "P", "P", "P", "P", "H", "H", "S", "H"], // Pair of 7s
  ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"], // Pair of 8s
  ["P", "P", "P", "P", "P", "S", "P", "P", "S", "S"], // Pair of 9s
  ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"], // Pair of 10s
];

export class ActionStrategy {
  private blackjackStrategy: string[][];
  private softHandStrategy: string[][];
  private pairStrategy: string[][];

  public constructor(
    blackjackStrategy: string[][] = defaultBlackjackStrategy,
    softHandStrategy: string[][] = defaultSoftHandStrategy,
    pairStrategy: string[][] = defaultPairStrategy
  ) {
    this.blackjackStrategy = blackjackStrategy;
    this.softHandStrategy = softHandStrategy;
    this.pairStrategy = pairStrategy;

    if (
      this.blackjackStrategy.length !== 10 ||
      this.blackjackStrategy.some((row) => row.length !== 10)
    ) {
      throw new Error("Invalid blackjack strategy");
    }

    if (
      this.softHandStrategy.length !== 8 ||
      this.softHandStrategy.some((row) => row.length !== 10)
    ) {
      throw new Error("Invalid soft hand strategy");
    }

    if (
      this.pairStrategy.length !== 10 ||
      this.pairStrategy.some((row) => row.length !== 10)
    ) {
      throw new Error("Invalid pair strategy");
    }
  }

  public getBlackjackAction(action: string): BlackjackAction {
    switch (action) {
      case "H":
        return BlackjackAction.Hit;
      case "S":
        return BlackjackAction.Stand;
      case "D":
        return BlackjackAction.Double;
      case "P":
        return BlackjackAction.Split;
      default:
        throw new Error(`Invalid action: ${action}`);
    }
  }

  public getPlayAction(
    playerHand: PlayerHand,
    dealerHand: DealerHand,
    handNumber: number
  ): BlackjackAction {
    const playerSum = playerHand.getSum(handNumber);
    const dealerFaceUpCard = dealerHand.getFaceUpCard().getValue();
    const dealerIndex = dealerFaceUpCard === 1 ? 9 : dealerFaceUpCard - 2; // Adjust for Ace being last

    if (playerHand.getSum(handNumber) >= 21) {
      return BlackjackAction.Stand;
    }

    if (playerHand.hasPair(handNumber)) {
      const pairValue = playerHand.getPairCard(handNumber).getValue();
      const pairIndex = pairValue - 1;
      const action = this.pairStrategy[pairIndex][dealerIndex];
      return this.getBlackjackAction(action);
    }

    if (
      playerHand.hasAce(handNumber) &&
      playerHand.getValueWithoutAce(handNumber) <= 9
    ) {
      const valueWithoutAce = playerHand.getValueWithoutAce(handNumber);
      console.log(valueWithoutAce + "is ace without ace");
      const action = this.softHandStrategy[valueWithoutAce - 2][dealerIndex];
      return this.getBlackjackAction(action);
    }

    if (playerSum < 8) {
      return BlackjackAction.Hit;
    } else if (playerSum > 17) {
      return BlackjackAction.Stand;
    }

    const action = this.blackjackStrategy[playerSum - 8][dealerIndex];
    return this.getBlackjackAction(action);
  }
}
