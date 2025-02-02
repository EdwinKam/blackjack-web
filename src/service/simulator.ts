import { CardDistributor } from "../model/CardDistributor";
import runGame from "./gameRunner";

export class Simulator {
  public progressPercent: number = 0;

  public constructor() {}

  public startSimulation(
    totalGame: number,
    cutOff: number,
    numberOfDecks: number
  ): Promise<void> {
    return new Promise((resolve) => {
      const cards = new CardDistributor(cutOff, numberOfDecks);
      cards.shuffle();
      let totalWin = 0;
      let i = 0;
      const batchSize = 1000; // Number of games to run in each batch

      const runBatch = () => {
        const end = Math.min(i + batchSize, totalGame);

        for (; i < end; i++) {
          const game = runGame(cards);
          totalWin += game.playerWin;

          if (i % Math.floor(totalGame / 100) === 0) {
            this.progressPercent = Math.floor((i / totalGame) * 100);
          }
        }

        if (i < totalGame) {
          setTimeout(runBatch, 0); // Schedule the next batch
        } else {
          console.log(`Total win: ${(totalWin / totalGame) * 100}%`);
          resolve();
        }
      };

      runBatch(); // Start the first batch
    });
  }

  public getProgress(): number {
    return this.progressPercent;
  }
}
