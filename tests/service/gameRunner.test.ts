import { BlackjackAction } from "../../src/model/BlackjackAction";
import { Card } from "../../src/model/Card";
import { CardDistributor } from "../../src/model/CardDistributor";
import runGame, { GameResult } from "../../src/service/gameRunner";
import { getPlayAction } from "../../src/service/strategyService";

// Mock only the getPlayAction function
jest.mock("../../src/service/strategyService");

describe("runGame", () => {
  let cardDistributor: jest.Mocked<CardDistributor>;

  beforeEach(() => {
    cardDistributor = {
      dealCard: jest.fn(),
      ifCutCardReachedThenShuffle: jest.fn(),
    } as unknown as jest.Mocked<CardDistributor>;
  });

  it("should return Stand for a player blackjack", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(1)) // Player Ace
      .mockReturnValueOnce(new Card(10)) // Dealer 10
      .mockReturnValueOnce(new Card(10)) // Player 10
      .mockReturnValueOnce(new Card(9)); // Dealer 9

    // Mock getPlayAction to return Stand
    (getPlayAction as jest.Mock).mockReturnValue(BlackjackAction.Stand);

    const result: GameResult = runGame(cardDistributor);

    expect(result.playerWin).toBe(1.5);
  });

  it("should return player win with blackjack", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(1)) // Player Ace
      .mockReturnValueOnce(new Card(10)) // Dealer 10
      .mockReturnValueOnce(new Card(10)) // Player 10
      .mockReturnValueOnce(new Card(9)); // Dealer 9

    (getPlayAction as jest.Mock).mockReturnValue(BlackjackAction.Stand);

    const result: GameResult = runGame(cardDistributor);

    expect(result.playerWin).toBe(1.5);
  });

  it("should return dealer win with blackjack", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(10)) // Player 10
      .mockReturnValueOnce(new Card(1)) // Dealer Ace
      .mockReturnValueOnce(new Card(9)) // Player 9
      .mockReturnValueOnce(new Card(10)); // Dealer 10

    (getPlayAction as jest.Mock).mockReturnValue(BlackjackAction.Stand);

    const result: GameResult = runGame(cardDistributor);

    expect(result.playerWin).toBe(-1);
  });

  // Add more tests as needed
});
