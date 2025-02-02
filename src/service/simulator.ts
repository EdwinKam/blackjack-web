import { CardDistributor } from "../model/CardDistributor";
import runGame from "./gameRunner";

export default function startSimulation(
  totalGame: number,
  cutOff: number,
  numberOfDecks: number
): Promise<void> {
  return new Promise((resolve) => {
    const cards = new CardDistributor(cutOff, numberOfDecks);
    cards.shuffle();
    let totalWin = 0;
    let i = 0;

    // Separate function to handle the simulation loop
    function runSimulation() {
      if (i < totalGame) {
        const game = runGame(cards);
        totalWin += game.playerWin;
        i++;

        if (i % 1000 === 0) {
          // Yield control back to the browser every 1000 iterations
          setTimeout(runSimulation, 0);
        } else {
          runSimulation();
        }
      } else {
        console.log(`Total win: ${(totalWin / totalGame) * 100}%`);
        resolve(); // Resolve the promise when done
      }
    }

    runSimulation(); // Start the simulation
  });
}
