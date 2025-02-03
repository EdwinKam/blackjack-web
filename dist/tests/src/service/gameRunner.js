"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runGame;
var BlackjackAction_1 = require("../model/BlackjackAction");
var DealerHand_1 = require("../model/DealerHand");
var PlayerHand_1 = require("../model/PlayerHand");
function runGame(cardDistributor, actionStrategy) {
    cardDistributor.ifCutCardReachedThenShuffle();
    var dealerHand = new DealerHand_1.DealerHand();
    var playerHand = new PlayerHand_1.PlayerHand();
    playerHand.hitCard(cardDistributor.dealCard(), 0);
    dealerHand.addCard(cardDistributor.dealCard());
    playerHand.hitCard(cardDistributor.dealCard(), 0);
    dealerHand.addCard(cardDistributor.dealCard());
    if (playerHand.isBlackjack(0) && dealerHand.isBlackjack()) {
        return { playerHand: playerHand, dealerHand: dealerHand, playerWin: 0 };
    }
    else if (playerHand.isBlackjack(0)) {
        return { playerHand: playerHand, dealerHand: dealerHand, playerWin: 1.5 };
    }
    else if (dealerHand.isBlackjack()) {
        return { playerHand: playerHand, dealerHand: dealerHand, playerWin: -1 };
    }
    var playHandCount = 1;
    var totalWin = 0;
    var haha = 0;
    var atLeastOneHandNotBusted = false;
    for (var handNumber = 0; handNumber < playHandCount; handNumber++) {
        var playAction = void 0;
        do {
            if (playerHand.onlyHasOneCard(handNumber)) {
                // could happen after the player split
                playerHand.hitCard(cardDistributor.dealCard(), handNumber);
            }
            playAction = actionStrategy.getPlayAction(playerHand, dealerHand, handNumber);
            switch (playAction) {
                case BlackjackAction_1.BlackjackAction.Hit:
                    playerHand.hitCard(cardDistributor.dealCard(), handNumber);
                    break;
                case BlackjackAction_1.BlackjackAction.Stand:
                    break;
                case BlackjackAction_1.BlackjackAction.Double:
                    playerHand.doubleCard(cardDistributor.dealCard(), handNumber);
                    break;
                case BlackjackAction_1.BlackjackAction.Split:
                    playerHand.splitHand(handNumber);
                    playHandCount = playerHand.getHandsCount();
                    break;
                default:
                    throw new Error("Invalid action: ".concat(playAction));
            }
        } while (playAction !== BlackjackAction_1.BlackjackAction.Stand &&
            playAction !== BlackjackAction_1.BlackjackAction.Double &&
            haha++ < 20);
        if (playerHand.getSum(handNumber) <= 21) {
            atLeastOneHandNotBusted = true;
        }
    }
    if (atLeastOneHandNotBusted) {
        dealerHand.addCardUntil17(cardDistributor);
    }
    for (var handNumber = 0; handNumber < playHandCount; handNumber++) {
        if (playerHand.getSum(handNumber) > 21) {
            totalWin -= playerHand.getBaseBetRatio(handNumber);
        }
        else if (dealerHand.getSum() > 21) {
            totalWin += playerHand.getBaseBetRatio(handNumber);
        }
        else if (playerHand.getSum(handNumber) > dealerHand.getSum()) {
            totalWin += playerHand.getBaseBetRatio(handNumber);
        }
        else if (playerHand.getSum(handNumber) < dealerHand.getSum()) {
            totalWin -= playerHand.getBaseBetRatio(handNumber);
        }
    }
    return { playerHand: playerHand, dealerHand: dealerHand, playerWin: totalWin };
}
