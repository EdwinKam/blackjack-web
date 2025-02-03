"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardDistributor = void 0;
var Card_1 = require("./Card");
var CardDistributor = /** @class */ (function () {
    function CardDistributor(cutOff, numberOfDecks) {
        this.currentIndex = 0;
        this.deck = this.createDeck(numberOfDecks);
        this.cutOff = cutOff;
    }
    // Create a standard deck of 52 cards
    CardDistributor.prototype.createDeck = function (numberOfDecks) {
        var deck = [];
        var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
        for (var numOfDeck = 0; numOfDeck < numberOfDecks; numOfDeck++) {
            for (var _i = 0, suits_1 = suits; _i < suits_1.length; _i++) {
                var __ = suits_1[_i];
                for (var rank = 1; rank <= 13; rank++) {
                    deck.push(new Card_1.Card(rank));
                }
            }
        }
        return deck;
    };
    CardDistributor.prototype.shuffle = function () {
        for (var i = 0; i < this.deck.length; i++) {
            var j = Math.floor(Math.random() * this.deck.length);
            var temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
        this.currentIndex = 0;
    };
    CardDistributor.prototype.dealCard = function () {
        return this.deck[this.currentIndex++];
    };
    CardDistributor.prototype.ifCutCardReachedThenShuffle = function () {
        if (this.currentIndex >= this.deck.length * this.cutOff) {
            this.shuffle();
        }
    };
    return CardDistributor;
}());
exports.CardDistributor = CardDistributor;
