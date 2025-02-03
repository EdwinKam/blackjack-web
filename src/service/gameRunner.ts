import { ActionStrategy } from "../model/ActionStrategy";
import { BlackjackAction } from "../model/BlackjackAction";
import { CardDistributor } from "../model/CardDistributor";
import { DealerHand } from "../model/DealerHand";
import { PlayerHand } from "../model/PlayerHand";

export interface GameResult {
  playerHand: PlayerHand;
  dealerHand: DealerHand;
  playerWin: number;
}

export default function runGame(
  cardDistributor: CardDistributor,
  actionStrategy: ActionStrategy
): GameResult {
  cardDistributor.ifCutCardReachedThenShuffle();
  const dealerHand = new DealerHand();
  const playerHand = new PlayerHand();

  playerHand.hitCard(cardDistributor.dealCard(), 0);
  dealerHand.addCard(cardDistributor.dealCard());
  playerHand.hitCard(cardDistributor.dealCard(), 0);
  dealerHand.addCard(cardDistributor.dealCard());

  if (playerHand.isBlackjack(0) && dealerHand.isBlackjack()) {
    return { playerHand, dealerHand, playerWin: 0 };
  } else if (playerHand.isBlackjack(0)) {
    return { playerHand, dealerHand, playerWin: 1.5 };
  } else if (dealerHand.isBlackjack()) {
    return { playerHand, dealerHand, playerWin: -1 };
  }

  let playHandCount = 1;
  let totalWin = 0;
  let haha = 0;
  let atLeastOneHandNotBusted = false;

  for (let handNumber = 0; handNumber < playHandCount; handNumber++) {
    let playAction;
    do {
      if (playerHand.onlyHasOneCard(handNumber)) {
        // could happen after the player split
        playerHand.hitCard(cardDistributor.dealCard(), handNumber);
      }
      playAction = actionStrategy.getPlayAction(
        playerHand,
        dealerHand,
        handNumber
      );
      switch (playAction) {
        case BlackjackAction.Hit:
          playerHand.hitCard(cardDistributor.dealCard(), handNumber);
          break;
        case BlackjackAction.Stand:
          break;
        case BlackjackAction.Double:
          playerHand.doubleCard(cardDistributor.dealCard(), handNumber);
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

    if (playerHand.getSum(handNumber) <= 21) {
      atLeastOneHandNotBusted = true;
    }
  }

  if (atLeastOneHandNotBusted) {
    dealerHand.addCardUntil17(cardDistributor);
  }
  for (let handNumber = 0; handNumber < playHandCount; handNumber++) {
    if (playerHand.getSum(handNumber) > 21) {
      totalWin -= playerHand.getBaseBetRatio(handNumber);
    } else if (dealerHand.getSum() > 21) {
      totalWin += playerHand.getBaseBetRatio(handNumber);
    } else if (playerHand.getSum(handNumber) > dealerHand.getSum()) {
      totalWin += playerHand.getBaseBetRatio(handNumber);
    } else if (playerHand.getSum(handNumber) < dealerHand.getSum()) {
      totalWin -= playerHand.getBaseBetRatio(handNumber);
    }
  }

  return { playerHand, dealerHand, playerWin: totalWin };
}
