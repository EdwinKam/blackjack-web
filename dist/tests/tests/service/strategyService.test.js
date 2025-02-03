"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerHand_1 = require("../../src/model/PlayerHand");
var DealerHand_1 = require("../../src/model/DealerHand");
var Card_1 = require("../../src/model/Card");
var BlackjackAction_1 = require("../../src/model/BlackjackAction");
var ActionStrategy_1 = require("../../src/model/ActionStrategy");
describe("getPlayAction", function () {
    var playerHand;
    var dealerHand;
    var actionStrategy;
    beforeEach(function () {
        playerHand = new PlayerHand_1.PlayerHand();
        dealerHand = new DealerHand_1.DealerHand();
        actionStrategy = new ActionStrategy_1.ActionStrategy(); // Create an instance of actionStrategy
    });
    it("should return Stand for a player blackjack", function () {
        playerHand.hitCard(new Card_1.Card(1), 0); // Ace
        playerHand.hitCard(new Card_1.Card(10), 0); // 10
        dealerHand.addCard(new Card_1.Card(5)); // Dealer's face-up card
        var action = actionStrategy.getPlayAction(playerHand, dealerHand, 0);
        expect(action).toBe(BlackjackAction_1.BlackjackAction.Stand);
    });
    it("should return Hit for player sum 8 against dealer 10", function () {
        playerHand.hitCard(new Card_1.Card(5), 0);
        playerHand.hitCard(new Card_1.Card(3), 0);
        dealerHand.addCard(new Card_1.Card(10)); // Dealer's face-up card
        var action = actionStrategy.getPlayAction(playerHand, dealerHand, 0);
        expect(action).toBe(BlackjackAction_1.BlackjackAction.Hit);
    });
    it("should return Double for player sum 11 against dealer 6", function () {
        playerHand.hitCard(new Card_1.Card(6), 0);
        playerHand.hitCard(new Card_1.Card(5), 0);
        dealerHand.addCard(new Card_1.Card(6)); // Dealer's face-up card
        var action = actionStrategy.getPlayAction(playerHand, dealerHand, 0);
        expect(action).toBe(BlackjackAction_1.BlackjackAction.Double);
    });
    it("should return Split for pair of 8s against dealer 5", function () {
        playerHand.hitCard(new Card_1.Card(8), 0);
        playerHand.hitCard(new Card_1.Card(8), 0);
        dealerHand.addCard(new Card_1.Card(5)); // Dealer's face-up card
        var action = actionStrategy.getPlayAction(playerHand, dealerHand, 0);
        expect(action).toBe(BlackjackAction_1.BlackjackAction.Split);
    });
    it("should return Stand for soft 18 against dealer 2", function () {
        playerHand.hitCard(new Card_1.Card(1), 0); // Ace
        playerHand.hitCard(new Card_1.Card(7), 0);
        dealerHand.addCard(new Card_1.Card(2)); // Dealer's face-up card
        var action = actionStrategy.getPlayAction(playerHand, dealerHand, 0);
        expect(action).toBe(BlackjackAction_1.BlackjackAction.Stand);
    });
});
describe("getPlayAction - Edge Cases", function () {
    var playerHand;
    var dealerHand;
    var actionStrategy;
    beforeEach(function () {
        playerHand = new PlayerHand_1.PlayerHand();
        dealerHand = new DealerHand_1.DealerHand();
        actionStrategy = new ActionStrategy_1.ActionStrategy(); // Create an instance of actionStrategy
    });
    it("should handle a hand with more than two cards", function () {
        playerHand.hitCard(new Card_1.Card(2), 0);
        playerHand.hitCard(new Card_1.Card(3), 0);
        playerHand.hitCard(new Card_1.Card(4), 0);
        playerHand.hitCard(new Card_1.Card(5), 0);
        dealerHand.addCard(new Card_1.Card(10)); // Dealer's face-up card
        var action = actionStrategy.getPlayAction(playerHand, dealerHand, 0);
        expect(action).toBe(BlackjackAction_1.BlackjackAction.Hit); // Assuming strategy for sum 14 against 10 is Hit
    });
    it("should handle split hands correctly", function () {
        playerHand.hitCard(new Card_1.Card(8), 0);
        playerHand.hitCard(new Card_1.Card(8), 0);
        dealerHand.addCard(new Card_1.Card(5)); // Dealer's face-up card
        var action1 = actionStrategy.getPlayAction(playerHand, dealerHand, 0);
        expect(action1).toBe(BlackjackAction_1.BlackjackAction.Split);
    });
    it("should not go out of bounds when accessing hand numbers", function () {
        playerHand.hitCard(new Card_1.Card(10), 0);
        playerHand.hitCard(new Card_1.Card(10), 0);
        dealerHand.addCard(new Card_1.Card(6)); // Dealer's face-up card
        // Attempt to access a non-existent hand
        expect(function () {
            return actionStrategy.getPlayAction(playerHand, dealerHand, 1);
        }).toThrowError();
    });
    it("should handle a hand with multiple Aces correctly", function () {
        playerHand.hitCard(new Card_1.Card(1), 0); // Ace
        playerHand.hitCard(new Card_1.Card(1), 0); // Ace
        playerHand.hitCard(new Card_1.Card(9), 0);
        dealerHand.addCard(new Card_1.Card(7)); // Dealer's face-up card
        var action = actionStrategy.getPlayAction(playerHand, dealerHand, 0);
        expect(action).toBe(BlackjackAction_1.BlackjackAction.Stand); // Assuming strategy for soft 21 is Stand
    });
    it("should handle a hand with a bust scenario", function () {
        playerHand.hitCard(new Card_1.Card(10), 0);
        playerHand.hitCard(new Card_1.Card(10), 0);
        playerHand.hitCard(new Card_1.Card(5), 0);
        dealerHand.addCard(new Card_1.Card(6)); // Dealer's face-up card
        var action = actionStrategy.getPlayAction(playerHand, dealerHand, 0);
        expect(action).toBe(BlackjackAction_1.BlackjackAction.Stand); // Assuming strategy for bust is Stand
    });
});
