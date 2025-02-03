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

    const result: GameResult = runGame(cardDistributor, actionStrategy);

    expect(result.playerWin).toBe(1.5);
  });

  it("should return player win with blackjack", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(1)) // Player Ace
      .mockReturnValueOnce(new Card(10)) // Dealer 10
      .mockReturnValueOnce(new Card(10)) // Player 10
      .mockReturnValueOnce(new Card(9)); // Dealer 9

    actionStrategy.getPlayAction.mockReturnValue(BlackjackAction.Stand);

    const result: GameResult = runGame(cardDistributor, actionStrategy);

    expect(result.playerWin).toBe(1.5);
  });

  it("should return dealer win with blackjack", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(10)) // Player 10
      .mockReturnValueOnce(new Card(1)) // Dealer Ace
      .mockReturnValueOnce(new Card(9)) // Player 9
      .mockReturnValueOnce(new Card(10)); // Dealer 10

    actionStrategy.getPlayAction.mockReturnValue(BlackjackAction.Stand);

    const result: GameResult = runGame(cardDistributor, actionStrategy);

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

    const result: GameResult = runGame(cardDistributor, actionStrategy);

    expect(result.playerWin).toBe(-1); // Player loses due to bust
  });

  // Add the rest of your tests here, following the same pattern
});
