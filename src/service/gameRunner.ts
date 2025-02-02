import { CardDistributor } from "../model/CardDistributor";
import { DealerHand } from "../model/DealerHand";
import { PlayerHand } from "../model/PlayerHand";
import { BlackjackAction, getPlayAction } from "./strategyService";

export interface GameResult {
  playerHand: PlayerHand;
  dealerHand: DealerHand;
  playerWin: number;
}

export default function runGame(cardDistributor: CardDistributor): GameResult {
  cardDistributor.ifCutCardReachedThenShuffle();
  const dealerHand = new DealerHand();
  const playerHand = new PlayerHand();

  playerHand.addCard(cardDistributor.dealCard(), 0);
  dealerHand.addCard(cardDistributor.dealCard());
  playerHand.addCard(cardDistributor.dealCard(), 0);
  dealerHand.addCard(cardDistributor.dealCard());

  if (playerHand.isBlackjack(0) && dealerHand.isBlackjack()) {
    return { playerHand, dealerHand, playerWin: 0 };
  } else if (playerHand.isBlackjack(0)) {
    return { playerHand, dealerHand, playerWin: 1.5 };
  } else if (dealerHand.isBlackjack()) {
    return { playerHand, dealerHand, playerWin: -1 };
  }

  let playHandCount = 1;
  let totleWin = 0;
  let haha = 0;

  for (let handNumber = 0; handNumber < playHandCount; handNumber++) {
    let playBaseBetRatio = 1;
    let playAction;
    do {
      playAction = getPlayAction(playerHand, dealerHand, handNumber);
      switch (playAction) {
        case BlackjackAction.Hit:
          playerHand.addCard(cardDistributor.dealCard(), handNumber);
          break;
        case BlackjackAction.Stand:
          break;
        case BlackjackAction.Double:
          playerHand.addCard(cardDistributor.dealCard(), handNumber);
          playBaseBetRatio = 2;
          break;
        case BlackjackAction.Split:
          playerHand.splitHand(handNumber);
          playHandCount = playerHand.getHandsCount();
          break;
        default:
          throw new Error(`Invalid action: ${playAction}`);
      }
    } while (
      playAction !== BlackjackAction.Stand &&
      playAction !== BlackjackAction.Double &&
      haha++ < 20
    );

    // check if player bust
    if (playerHand.getSum(handNumber) > 21) {
      totleWin -= playBaseBetRatio;
    }
  }
  return { playerHand, dealerHand, playerWin: totleWin };
}
