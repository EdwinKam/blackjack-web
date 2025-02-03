"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
var Card = /** @class */ (function () {
    function Card(rank) {
        this.rank = rank;
    }
    Card.prototype.toString = function () {
        switch (this.rank) {
            case 1:
                return "A";
            case 11:
                return "J";
            case 12:
                return "Q";
            case 13:
                return "K";
            default:
                return this.rank.toString();
        }
    };
    Card.prototype.getValue = function () {
        switch (this.rank) {
            case 11:
            case 12:
            case 13:
                return 10;
            default:
                return this.rank;
        }
    };
    return Card;
}());
exports.Card = Card;
