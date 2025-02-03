"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionStrategy_1 = require("../../src/model/ActionStrategy");
var BlackjackAction_1 = require("../../src/model/BlackjackAction");
var Card_1 = require("../../src/model/Card");
var gameRunner_1 = require("../../src/service/gameRunner");
describe("runGame", function () {
    var cardDistributor;
    var actionStrategy;
    beforeEach(function () {
        cardDistributor = {
            dealCard: jest.fn(),
            ifCutCardReachedThenShuffle: jest.fn(),
        };
        actionStrategy = new ActionStrategy_1.ActionStrategy();
        actionStrategy.getPlayAction = jest.fn();
    });
    it("should return Stand for a player blackjack", function () {
        cardDistributor.dealCard
            .mockReturnValueOnce(new Card_1.Card(1)) // Player Ace
            .mockReturnValueOnce(new Card_1.Card(10)) // Dealer 10
            .mockReturnValueOnce(new Card_1.Card(10)) // Player 10
            .mockReturnValueOnce(new Card_1.Card(9)); // Dealer 9
        actionStrategy.getPlayAction.mockReturnValue(BlackjackAction_1.BlackjackAction.Stand);
        var result = (0, gameRunner_1.default)(cardDistributor, actionStrategy);
        expect(result.playerWin).toBe(1.5);
    });
    it("should return player win with blackjack", function () {
        cardDistributor.dealCard
            .mockReturnValueOnce(new Card_1.Card(1)) // Player Ace
            .mockReturnValueOnce(new Card_1.Card(10)) // Dealer 10
            .mockReturnValueOnce(new Card_1.Card(10)) // Player 10
            .mockReturnValueOnce(new Card_1.Card(9)); // Dealer 9
        actionStrategy.getPlayAction.mockReturnValue(BlackjackAction_1.BlackjackAction.Stand);
        var result = (0, gameRunner_1.default)(cardDistributor, actionStrategy);
        expect(result.playerWin).toBe(1.5);
    });
    it("should return dealer win with blackjack", function () {
        cardDistributor.dealCard
            .mockReturnValueOnce(new Card_1.Card(10)) // Player 10
            .mockReturnValueOnce(new Card_1.Card(1)) // Dealer Ace
            .mockReturnValueOnce(new Card_1.Card(9)) // Player 9
            .mockReturnValueOnce(new Card_1.Card(10)); // Dealer 10
        actionStrategy.getPlayAction.mockReturnValue(BlackjackAction_1.BlackjackAction.Stand);
        var result = (0, gameRunner_1.default)(cardDistributor, actionStrategy);
        expect(result.playerWin).toBe(-1);
    });
    // Continue with the rest of your tests, ensuring each uses ActionStrategy.getPlayAction
    it("should result in a player bust", function () {
        cardDistributor.dealCard
            .mockReturnValueOnce(new Card_1.Card(10)) // Player 10
            .mockReturnValueOnce(new Card_1.Card(5)) // Dealer 5
            .mockReturnValueOnce(new Card_1.Card(6)) // Player 6
            .mockReturnValueOnce(new Card_1.Card(9)) // Dealer 9
            .mockReturnValueOnce(new Card_1.Card(10)); // Player hits and gets 10, busting
        actionStrategy.getPlayAction
            .mockReturnValueOnce(BlackjackAction_1.BlackjackAction.Hit) // Player hits
            .mockReturnValueOnce(BlackjackAction_1.BlackjackAction.Stand); // Player stands after busting
        var result = (0, gameRunner_1.default)(cardDistributor, actionStrategy);
        expect(result.playerWin).toBe(-1); // Player loses due to bust
    });
    // Add the rest of your tests here, following the same pattern
});
