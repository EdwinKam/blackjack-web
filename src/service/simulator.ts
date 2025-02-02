import { CardDistributor } from "../model/CardDistributor";
import runGame from "./gameRunner";

export default function startSimulation(
  totalGame: number,
  cutOff: number,
  numberOfDecks: number
) {
  const cards = new CardDistributor(cutOff, numberOfDecks);
  cards.shuffle();
  let totalWin = 0;
  const logInterval = totalGame / 100; // 1% of the total games

  for (let i = 0; i < totalGame; i++) {
    if (i % logInterval === 0) {
      console.log(`Simulation progress: ${(i / totalGame) * 100}%`);
    }
    const game = runGame(cards);
    // console.log(game.dealerHand.toString());
    // console.log(game.playerHand.toString());
    // console.log(game.playerWin);
    totalWin += game.playerWin;
  }
  console.log(`Total win: ${(totalWin / totalGame) * 100}%`);
}
