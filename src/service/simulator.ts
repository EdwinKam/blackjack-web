import { CardDistributor } from "../model/CardDistributor";
import runGame from "./gameRunner";

export default function startSimulation() {
  const cards = new CardDistributor(0.5, 1);
  cards.shuffle();
  const game = runGame(cards);
  console.log("dealerHand", game.dealerHand.toString());
  console.log("playerHand", game.playerHand.toString());
  console.log("playerWin", game.playerWin);
}
