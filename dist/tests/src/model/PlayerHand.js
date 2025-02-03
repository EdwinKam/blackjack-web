"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerHand = void 0;
var PlayerHand = /** @class */ (function () {
    function PlayerHand() {
        this.hands = [];
        this.baseBetRatio = [1];
        this.hands = [[]];
    }
    PlayerHand.prototype.hitCard = function (card, handNumber) {
        this.hands[handNumber].push(card);
    };
    PlayerHand.prototype.doubleCard = function (card, handNumber) {
        this.baseBetRatio[handNumber] = 2;
        this.hands[handNumber].push(card);
    };
    PlayerHand.prototype.getSum = function (handNumber) {
        var sum = 0;
        var aceCount = 0;
        for (var i = 0; i < this.hands[handNumber].length; i++) {
            if (this.hands[handNumber][i].getValue() === 1) {
                aceCount++;
            }
            sum += this.hands[handNumber][i].getValue();
        }
        while (sum <= 11 && aceCount > 0) {
            sum += 10;
            aceCount--;
        }
        return sum;
    };
    PlayerHand.prototype.isBlackjack = function (handNumber) {
        return (this.hands[handNumber].length === 2 && this.getSum(handNumber) === 21);
    };
    PlayerHand.prototype.hasPair = function (handNumber) {
        return (this.hands[handNumber].length === 2 &&
            this.hands[handNumber][0].getValue() ===
                this.hands[handNumber][1].getValue());
    };
    PlayerHand.prototype.hasAce = function (handNumber) {
        return this.hands[handNumber].some(function (card) { return card.getValue() === 1; });
    };
    PlayerHand.prototype.getPairCard = function (handNumber) {
        return this.hands[handNumber][0];
    };
    PlayerHand.prototype.getValueWithoutAce = function (handNumber) {
        if (this.hasAce(handNumber)) {
            var sum = 0;
            for (var i = 0; i < this.hands[handNumber].length; i++) {
                sum += this.hands[handNumber][i].getValue();
            }
            return sum;
        }
        else {
            return 0;
        }
    };
    PlayerHand.prototype.splitHand = function (handNumber) {
        var card = this.hands[handNumber].pop();
        this.hands.push([card]);
        this.baseBetRatio.push(1);
    };
    PlayerHand.prototype.getHandsCount = function () {
        return this.hands.length;
    };
    PlayerHand.prototype.toString = function () {
        return ("player: " +
            this.hands
                .map(function (hand) { return hand.map(function (card) { return card.toString(); }).join(", "); })
                .join(" | ") +
            " (".concat(this.getSum(0), ")"));
    };
    PlayerHand.prototype.getBaseBetRatio = function (handNumber) {
        return this.baseBetRatio[handNumber];
    };
    PlayerHand.prototype.onlyHasOneCard = function (handNumber) {
        return this.hands[handNumber].length === 1;
    };
    return PlayerHand;
}());
exports.PlayerHand = PlayerHand;
