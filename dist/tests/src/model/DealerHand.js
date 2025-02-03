"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealerHand = void 0;
var DealerHand = /** @class */ (function () {
    function DealerHand() {
        this.hand = [];
    }
    DealerHand.prototype.addCard = function (card) {
        this.hand.push(card);
    };
    DealerHand.prototype.getFaceUpCard = function () {
        return this.hand[0];
    };
    DealerHand.prototype.addCardUntil17 = function (cardDistributor) {
        while (this.getSum() < 17 || this.isSoft17()) {
            this.addCard(cardDistributor.dealCard());
        }
    };
    DealerHand.prototype.isSoft17 = function () {
        return (this.getSum() === 17 && this.hand.some(function (card) { return card.getValue() === 1; }));
    };
    DealerHand.prototype.getSum = function () {
        var sum = 0;
        var aceCount = 0;
        for (var i = 0; i < this.hand.length; i++) {
            if (this.hand[i].getValue() === 1) {
                aceCount++;
            }
            sum += this.hand[i].getValue();
        }
        while (sum <= 11 && aceCount > 0) {
            sum += 10;
            aceCount--;
        }
        return sum;
    };
    DealerHand.prototype.isBlackjack = function () {
        return this.hand.length === 2 && this.getSum() === 21;
    };
    DealerHand.prototype.toString = function () {
        return ("dealer: " +
            this.hand.map(function (card) { return card.toString(); }).join(", ") +
            " (".concat(this.getSum(), ")"));
    };
    return DealerHand;
}());
exports.DealerHand = DealerHand;
