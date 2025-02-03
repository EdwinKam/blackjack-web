"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionStrategy = exports.defaultPairStrategy = exports.defaultSoftHandStrategy = exports.defaultBlackjackStrategy = void 0;
var BlackjackAction_1 = require("./BlackjackAction");
exports.defaultBlackjackStrategy = [
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
exports.defaultSoftHandStrategy = [
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
exports.defaultPairStrategy = [
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
var ActionStrategy = /** @class */ (function () {
    function ActionStrategy(blackjackStrategy, softHandStrategy, pairStrategy) {
        if (blackjackStrategy === void 0) { blackjackStrategy = exports.defaultBlackjackStrategy; }
        if (softHandStrategy === void 0) { softHandStrategy = exports.defaultSoftHandStrategy; }
        if (pairStrategy === void 0) { pairStrategy = exports.defaultPairStrategy; }
        this.blackjackStrategy = blackjackStrategy;
        this.softHandStrategy = softHandStrategy;
        this.pairStrategy = pairStrategy;
        if (this.blackjackStrategy.length !== 10 ||
            this.blackjackStrategy.some(function (row) { return row.length !== 10; })) {
            throw new Error("Invalid blackjack strategy");
        }
        if (this.softHandStrategy.length !== 8 ||
            this.softHandStrategy.some(function (row) { return row.length !== 10; })) {
            throw new Error("Invalid soft hand strategy");
        }
        if (this.pairStrategy.length !== 10 ||
            this.pairStrategy.some(function (row) { return row.length !== 10; })) {
            throw new Error("Invalid pair strategy");
        }
    }
    ActionStrategy.prototype.getBlackjackAction = function (action) {
        switch (action) {
            case "H":
                return BlackjackAction_1.BlackjackAction.Hit;
            case "S":
                return BlackjackAction_1.BlackjackAction.Stand;
            case "D":
                return BlackjackAction_1.BlackjackAction.Double;
            case "P":
                return BlackjackAction_1.BlackjackAction.Split;
            default:
                throw new Error("Invalid action: ".concat(action));
        }
    };
    ActionStrategy.prototype.getPlayAction = function (playerHand, dealerHand, handNumber) {
        var playerSum = playerHand.getSum(handNumber);
        var dealerFaceUpCard = dealerHand.getFaceUpCard().getValue();
        if (playerHand.getSum(handNumber) >= 21) {
            return BlackjackAction_1.BlackjackAction.Stand;
        }
        if (playerHand.hasPair(handNumber)) {
            var pairValue = playerHand.getPairCard(handNumber).getValue();
            var pairIndex = pairValue - 1;
            // console.log(`checking pairStrategy[${pairIndex}][${dealerFaceUpCard - 1}]`);
            var action_1 = this.pairStrategy[pairIndex][dealerFaceUpCard - 1];
            return this.getBlackjackAction(action_1);
        }
        if (playerHand.hasAce(handNumber) &&
            playerHand.getValueWithoutAce(handNumber) <= 9) {
            var valueWithoutAce = playerHand.getValueWithoutAce(handNumber);
            // console.log(
            //   `checking softHandStrategry[${valueWithoutAce - 2}][${
            //     dealerFaceUpCard - 1
            //   }]`
            // );
            var action_2 = this.softHandStrategy[valueWithoutAce - 2][dealerFaceUpCard - 1];
            return this.getBlackjackAction(action_2);
        }
        if (playerSum < 8) {
            return BlackjackAction_1.BlackjackAction.Hit;
        }
        else if (playerSum > 17) {
            return BlackjackAction_1.BlackjackAction.Stand;
        }
        //   console.log(
        //     `checking blackjackStrategy[${playerSum - 8}][${dealerFaceUpCard - 1}]`
        //   );
        var action = this.blackjackStrategy[playerSum - 8][dealerFaceUpCard - 1];
        return this.getBlackjackAction(action);
    };
    return ActionStrategy;
}());
exports.ActionStrategy = ActionStrategy;
