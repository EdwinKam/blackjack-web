import { BlackjackAction } from "../model/BlackjackAction";
import { DealerHand } from "../model/DealerHand";
import { PlayerHand } from "../model/PlayerHand";

const blackjackStrategy: string[][] = [
  // A   2,   3,   4,   5,   6,   7,   8,   9,  10
  ["H", "H", "H", "D", "D", "H", "H", "H", "H", "H"], // Player sum 8
  ["H", "D", "D", "D", "D", "D", "H", "H", "H", "H"], // Player sum 9
  ["H", "D", "D", "D", "D", "D", "D", "D", "H", "H"], // Player sum 10
  ["H", "D", "D", "D", "D", "D", "D", "D", "D", "H"], // Player sum 11
  ["H", "H", "H", "S", "S", "S", "H", "H", "H", "H"], // Player sum 12
  ["H", "S", "S", "S", "S", "S", "H", "H", "H", "H"], // Player sum 13
  ["H", "S", "S", "S", "S", "S", "H", "H", "H", "H"], // Player sum 14
  ["H", "S", "S", "S", "S", "S", "H", "H", "H", "H"], // Player sum 15
  ["H", "S", "S", "S", "S", "S", "H", "H", "H", "H"], // Player sum 16
  ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"], // Player sum 17
];

const softHandStrategy: string[][] = [
  // A,  2  , 3,  4,     5,   6,  7,   8,   9,  10
  ["H", "H", "H", "H", "D", "D", "H", "H", "H", "H"], // Player soft 13 (A, 2)
  ["H", "H", "H", "H", "D", "D", "H", "H", "H", "H"], // Player soft 14 (A, 3)
  ["H", "H", "H", "D", "D", "D", "H", "H", "H", "H"], // Player soft 15 (A, 4)
  ["H", "H", "H", "D", "D", "D", "H", "H", "H", "H"], // Player soft 16 (A, 5)
  ["H", "H", "D", "D", "D", "D", "H", "H", "H", "H"], // Player soft 17 (A, 6)
  ["H", "S", "D", "D", "D", "D", "S", "S", "H", "H"], // Player soft 18 (A, 7)
  ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"], // Player soft 19 (A, 8)
  ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"], // Player soft 20 (A, 9)
];

const pairStrategy: string[][] = [
  // Dealer's face-up card: 11 (Ace), 2, 3, 4, 5, 6, 7, 8, 9, 10
  ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"], // Pair of Aces
  ["H", "P", "P", "P", "P", "P", "P", "H", "H", "H"], // Pair of 2s
  ["H", "P", "P", "P", "P", "P", "P", "H", "H", "H"], // Pair of 3s
  ["H", "H", "H", "H", "P", "P", "H", "H", "H", "H"], // Pair of 4s
  ["H", "D", "D", "D", "D", "D", "D", "D", "H", "H"], // Pair of 5s
  ["H", "P", "P", "P", "P", "P", "H", "H", "H", "H"], // Pair of 6s
  ["H", "P", "P", "P", "P", "P", "P", "H", "H", "S"], // Pair of 7s
  ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"], // Pair of 8s
  ["S", "P", "P", "P", "P", "P", "S", "P", "P", "S"], // Pair of 9s
  ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"], // Pair of 10s
];

function getBlackjackAction(action: string): BlackjackAction {
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

export function getPlayAction(
  playerHand: PlayerHand,
  dealerHand: DealerHand,
  handNumber: number
): BlackjackAction {
  const playerSum = playerHand.getSum(handNumber);
  const dealerFaceUpCard = dealerHand.getFaceUpCard().getValue();
  if (playerHand.getSum(handNumber) >= 21) {
    return BlackjackAction.Stand;
  }

  if (playerHand.hasPair(handNumber)) {
    const pairValue = playerHand.getPairCard(handNumber).getValue();
    const pairIndex = pairValue - 1;
    // console.log(`checking pairStrategy[${pairIndex}][${dealerFaceUpCard - 1}]`);
    const action = pairStrategy[pairIndex][dealerFaceUpCard - 1];
    return getBlackjackAction(action);
  }

  if (
    playerHand.hasAce(handNumber) &&
    playerHand.getValueWithoutAce(handNumber) <= 9
  ) {
    const valueWithoutAce = playerHand.getValueWithoutAce(handNumber);
    // console.log(
    //   `checking softHandStrategry[${valueWithoutAce - 2}][${
    //     dealerFaceUpCard - 1
    //   }]`
    // );
    const action = softHandStrategy[valueWithoutAce - 2][dealerFaceUpCard - 1];
    return getBlackjackAction(action);
  }

  if (playerSum < 8) {
    return BlackjackAction.Hit;
  } else if (playerSum > 17) {
    return BlackjackAction.Stand;
  }
  //   console.log(
  //     `checking blackjackStrategy[${playerSum - 8}][${dealerFaceUpCard - 1}]`
  //   );
  const action = blackjackStrategy[playerSum - 8][dealerFaceUpCard - 1];
  return getBlackjackAction(action);
}
