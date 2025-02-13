import { ActionStrategy } from "../../src/model/ActionStrategy";
import { BlackjackAction } from "../../src/model/BlackjackAction";
import { Card } from "../../src/model/Card";
import { CardDistributor } from "../../src/model/CardDistributor";
import runGame, { GameResult } from "../../src/service/gameRunner";

describe("runGame", () => {
  let cardDistributor: jest.Mocked<CardDistributor>;
  let actionStrategy: jest.Mocked<ActionStrategy>;

  beforeEach(() => {
    cardDistributor = {
      dealCard: jest.fn(),
      ifCutCardReachedThenShuffle: jest.fn(),
      getRunningCount: jest.fn(),
      getAdjustedRunningCount: jest.fn(),
      getRemainingCard: jest.fn(),
    } as unknown as jest.Mocked<CardDistributor>;

    actionStrategy = new ActionStrategy() as jest.Mocked<ActionStrategy>;
    actionStrategy.getPlayAction = jest.fn();
  });

  it("should return Stand for a player blackjack", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(1)) // Player Ace
      .mockReturnValueOnce(new Card(10)) // Dealer 10
      .mockReturnValueOnce(new Card(10)) // Player 10
      .mockReturnValueOnce(new Card(9)); // Dealer 9

    actionStrategy.getPlayAction.mockReturnValue(BlackjackAction.Stand);

    const result: GameResult = runGame(cardDistributor, actionStrategy, 1);

    expect(result.playerWin).toBe(1.5);
  });

  it("should return player win with blackjack", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(1)) // Player Ace
      .mockReturnValueOnce(new Card(10)) // Dealer 10
      .mockReturnValueOnce(new Card(10)) // Player 10
      .mockReturnValueOnce(new Card(9)); // Dealer 9

    actionStrategy.getPlayAction.mockReturnValue(BlackjackAction.Stand);

    const result: GameResult = runGame(cardDistributor, actionStrategy, 1);

    expect(result.playerWin).toBe(1.5);
  });

  it("should return dealer win with blackjack", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(10)) // Player 10
      .mockReturnValueOnce(new Card(1)) // Dealer Ace
      .mockReturnValueOnce(new Card(9)) // Player 9
      .mockReturnValueOnce(new Card(10)); // Dealer 10

    actionStrategy.getPlayAction.mockReturnValue(BlackjackAction.Stand);

    const result: GameResult = runGame(cardDistributor, actionStrategy, 1);

    expect(result.playerWin).toBe(-1);
  });

  // Continue with the rest of your tests, ensuring each uses ActionStrategy.getPlayAction

  it("should result in a player bust", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(10)) // Player 10
      .mockReturnValueOnce(new Card(5)) // Dealer 5
      .mockReturnValueOnce(new Card(6)) // Player 6
      .mockReturnValueOnce(new Card(9)) // Dealer 9
      .mockReturnValueOnce(new Card(10)); // Player hits and gets 10, busting

    actionStrategy.getPlayAction
      .mockReturnValueOnce(BlackjackAction.Hit) // Player hits
      .mockReturnValueOnce(BlackjackAction.Stand); // Player stands after busting

    const result: GameResult = runGame(cardDistributor, actionStrategy, 1);

    expect(result.playerWin).toBe(-1); // Player loses due to bust
  });

  it("should not allow double after hit", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(3)) // Player
      .mockReturnValueOnce(new Card(10)) // Deale
      .mockReturnValueOnce(new Card(3)) // Player
      .mockReturnValueOnce(new Card(10)) // Dealer
      .mockReturnValueOnce(new Card(3)) // Player
      .mockReturnValueOnce(new Card(3)); // Player

    actionStrategy.getPlayAction
      .mockReturnValueOnce(BlackjackAction.Hit) // Player hits
      .mockReturnValueOnce(BlackjackAction.Double) // double should fallback to hit
      .mockReturnValueOnce(BlackjackAction.Stand);

    const result: GameResult = runGame(cardDistributor, actionStrategy, 1);

    expect(result.playerWin).toBe(-1); // Player loses due to bust
  });

  it("should not allow hit after double", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(5)) // Player
      .mockReturnValueOnce(new Card(10)) // Deale
      .mockReturnValueOnce(new Card(6)) // Player
      .mockReturnValueOnce(new Card(7)) // Dealer
      .mockReturnValueOnce(new Card(3)) // Player
      .mockReturnValueOnce(new Card(6)); // Player

    actionStrategy.getPlayAction
      .mockReturnValueOnce(BlackjackAction.Double) // Player hits
      .mockReturnValueOnce(BlackjackAction.Hit); // this hit should not allowed

    const result: GameResult = runGame(cardDistributor, actionStrategy, 1);

    expect(result.playerWin).toBe(-2); // Player loses due to bust
  });

  it("test split both lose simple", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(6)) // Player
      .mockReturnValueOnce(new Card(4)) // Deale
      .mockReturnValueOnce(new Card(6)) // Player
      .mockReturnValueOnce(new Card(10)) // Dealer
      .mockReturnValueOnce(new Card(10)) // Player 1
      .mockReturnValueOnce(new Card(10)) // Player 2
      .mockReturnValueOnce(new Card(4)); // dealer 18 total

    actionStrategy.getPlayAction
      .mockReturnValueOnce(BlackjackAction.Split) // Player hits
      .mockReturnValueOnce(BlackjackAction.Stand) // stand first hand
      .mockReturnValueOnce(BlackjackAction.Stand); // stand second hand

    const result: GameResult = runGame(cardDistributor, actionStrategy, 1);

    expect(result.playerWin).toBe(-2); // both player hand lose, 16/16 to 18
  });

  it("test split both win hit both", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(6)) // Player
      .mockReturnValueOnce(new Card(4)) // Deale
      .mockReturnValueOnce(new Card(6)) // Player
      .mockReturnValueOnce(new Card(10)) // Dealer
      .mockReturnValueOnce(new Card(10)) // Player 1
      .mockReturnValueOnce(new Card(4)) // Player 1 -> 20
      .mockReturnValueOnce(new Card(10)) // Player 2
      .mockReturnValueOnce(new Card(5)) // Player 2 -> 21
      .mockReturnValueOnce(new Card(4)); // dealer 18 total

    actionStrategy.getPlayAction
      .mockReturnValueOnce(BlackjackAction.Split) // Player hits
      .mockReturnValueOnce(BlackjackAction.Hit) // Hit first hand
      .mockReturnValueOnce(BlackjackAction.Stand) // stand first hand
      .mockReturnValueOnce(BlackjackAction.Hit) // Hit first hand
      .mockReturnValueOnce(BlackjackAction.Stand); // stand second hand

    const result: GameResult = runGame(cardDistributor, actionStrategy, 1);

    expect(result.playerWin).toBe(2); // both hands win, 20/21 to 18
    // Verify that all mock values are used
    expect(cardDistributor.dealCard).toHaveBeenCalledTimes(9);
    expect(actionStrategy.getPlayAction).toHaveBeenCalledTimes(5);
  });

  it("test split both lost hit both", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(6)) // Player
      .mockReturnValueOnce(new Card(4)) // Deale
      .mockReturnValueOnce(new Card(6)) // Player
      .mockReturnValueOnce(new Card(10)) // Dealer
      .mockReturnValueOnce(new Card(10)) // Player 1
      .mockReturnValueOnce(new Card(4)) // Player 1 -> 20
      .mockReturnValueOnce(new Card(10)) // Player 2
      .mockReturnValueOnce(new Card(4)) // Player 2 -> 20
      .mockReturnValueOnce(new Card(7)); // dealer 21 total

    actionStrategy.getPlayAction
      .mockReturnValueOnce(BlackjackAction.Split) // Player hits
      .mockReturnValueOnce(BlackjackAction.Hit) // Hit first hand
      .mockReturnValueOnce(BlackjackAction.Stand) // stand first hand
      .mockReturnValueOnce(BlackjackAction.Hit) // Hit first hand
      .mockReturnValueOnce(BlackjackAction.Stand); // stand second hand

    const result: GameResult = runGame(cardDistributor, actionStrategy, 1);

    expect(result.playerWin).toBe(-2); // both hands win, 20/20 to 21
    // Verify that all mock values are used
    expect(cardDistributor.dealCard).toHaveBeenCalledTimes(9);
    expect(actionStrategy.getPlayAction).toHaveBeenCalledTimes(5);
  });

  it("test split 1 win 1 lost hit both", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(6)) // Player
      .mockReturnValueOnce(new Card(4)) // Deale
      .mockReturnValueOnce(new Card(6)) // Player
      .mockReturnValueOnce(new Card(10)) // Dealer
      .mockReturnValueOnce(new Card(10)) // Player 1
      .mockReturnValueOnce(new Card(3)) // Player 1 -> 19
      .mockReturnValueOnce(new Card(10)) // Player 2
      .mockReturnValueOnce(new Card(5)) // Player 2 -> 21
      .mockReturnValueOnce(new Card(6)); // dealer 20 total

    actionStrategy.getPlayAction
      .mockReturnValueOnce(BlackjackAction.Split) // Player hits
      .mockReturnValueOnce(BlackjackAction.Hit) // Hit first hand
      .mockReturnValueOnce(BlackjackAction.Stand) // stand first hand
      .mockReturnValueOnce(BlackjackAction.Hit) // Hit first hand
      .mockReturnValueOnce(BlackjackAction.Stand); // stand second hand

    const result: GameResult = runGame(cardDistributor, actionStrategy, 1);

    expect(result.playerWin).toBe(0); // both hands win, 20/20 to 21
    // Verify that all mock values are used
    expect(cardDistributor.dealCard).toHaveBeenCalledTimes(9);
    expect(actionStrategy.getPlayAction).toHaveBeenCalledTimes(5);
  });

  // Add the rest of your tests here, following the same pattern
});
