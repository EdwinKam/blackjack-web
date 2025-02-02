import { CardDistributor } from "../model/CardDistributor";
import runGame from "./gameRunner";

export default function startSimulation() {
  const cards = new CardDistributor(0.3, 5);
  cards.shuffle();
  let totalWin = 0;
  const totleGame = 10000000;
  const logInterval = totleGame / 100; // 1% of the total games

  for (let i = 0; i < totleGame; i++) {
    if (i % logInterval === 0) {
      console.log(`Simulation progress: ${(i / totleGame) * 100}%`);
    }
    const game = runGame(cards);
    // console.log(game.dealerHand.toString());
    // console.log(game.playerHand.toString());
    // console.log(game.playerWin);
    totalWin += game.playerWin;
  }
  console.log(`Total win: ${(totalWin / totleGame) * 100}%`);
}
