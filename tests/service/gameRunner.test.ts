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

  it("should result in a player bust", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(10)) // Player 10
      .mockReturnValueOnce(new Card(5)) // Dealer 5
      .mockReturnValueOnce(new Card(6)) // Player 6
      .mockReturnValueOnce(new Card(9)) // Dealer 9
      .mockReturnValueOnce(new Card(10)); // Player hits and gets 10, busting

    (getPlayAction as jest.Mock)
      .mockReturnValueOnce(BlackjackAction.Hit) // Player hits
      .mockReturnValueOnce(BlackjackAction.Stand); // Player stands after busting

    const result: GameResult = runGame(cardDistributor);

    expect(result.playerWin).toBe(-1); // Player loses due to bust
  });

  it("should result in a player split and win", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(8)) // Player 8
      .mockReturnValueOnce(new Card(10)) // Dealer 10
      .mockReturnValueOnce(new Card(8)) // Player 8
      .mockReturnValueOnce(new Card(7)) // Dealer 7
      .mockReturnValueOnce(new Card(10)) // First hand gets 10
      .mockReturnValueOnce(new Card(10)); // Second hand gets 10

    (getPlayAction as jest.Mock)
      .mockReturnValueOnce(BlackjackAction.Split) // Player splits
      .mockReturnValueOnce(BlackjackAction.Stand) // First hand stands
      .mockReturnValueOnce(BlackjackAction.Stand); // Second hand stands

    const result: GameResult = runGame(cardDistributor);

    expect(result.playerWin).toBe(2); // Player wins both hands
  });

  it("should result in a player split and 1win1lost", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(8)) // Player 8
      .mockReturnValueOnce(new Card(10)) // Dealer 10
      .mockReturnValueOnce(new Card(8)) // Player 8
      .mockReturnValueOnce(new Card(7)) // Dealer 7
      .mockReturnValueOnce(new Card(10)) // First hand gets 10
      .mockReturnValueOnce(new Card(5)); // Second hand gets 10

    (getPlayAction as jest.Mock)
      .mockReturnValueOnce(BlackjackAction.Split) // Player splits
      .mockReturnValueOnce(BlackjackAction.Stand) // First hand stands
      .mockReturnValueOnce(BlackjackAction.Stand); // Second hand stands

    const result: GameResult = runGame(cardDistributor);

    expect(result.playerWin).toBe(0); // Player wins both hands
  });

  it("should result in a player hit and win", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(10)) // Player 10
      .mockReturnValueOnce(new Card(10)) // Dealer 10
      .mockReturnValueOnce(new Card(5)) // Player 5
      .mockReturnValueOnce(new Card(10)) // Dealer 10
      .mockReturnValueOnce(new Card(6)); // Player hits and gets 6

    (getPlayAction as jest.Mock)
      .mockReturnValueOnce(BlackjackAction.Hit) // Player hits
      .mockReturnValueOnce(BlackjackAction.Stand); // Player stands

    const result: GameResult = runGame(cardDistributor);

    expect(result.playerWin).toBe(1); // Player wins
  });

  it("should result in a player double and win", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(10)) // Player 10
      .mockReturnValueOnce(new Card(10)) // Dealer 10
      .mockReturnValueOnce(new Card(10)) // Player 10
      .mockReturnValueOnce(new Card(10)) // Dealer 10
      .mockReturnValueOnce(new Card(1)); // Player double and gets 1

    (getPlayAction as jest.Mock).mockReturnValueOnce(BlackjackAction.Double); // Player hits

    const result: GameResult = runGame(cardDistributor);

    expect(result.playerWin).toBe(2); // Player wins
  });

  it("should result in a player double and win", () => {
    cardDistributor.dealCard
      .mockReturnValueOnce(new Card(5)) // Player 5
      .mockReturnValueOnce(new Card(10)) // Dealer 10
      .mockReturnValueOnce(new Card(5)) // Player 5
      .mockReturnValueOnce(new Card(10)) // Dealer 10
      .mockReturnValueOnce(new Card(2)); // Player double and gets 2

    (getPlayAction as jest.Mock).mockReturnValueOnce(BlackjackAction.Double); // Player hits

    const result: GameResult = runGame(cardDistributor);

    expect(result.playerWin).toBe(-2); // Player lost
  });
});
