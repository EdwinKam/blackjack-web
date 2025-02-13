import { ActionStrategy } from "../model/ActionStrategy";
import { CardDistributor } from "../model/CardDistributor";
import { RunningCountStrategy } from "../model/RunningCountStrategy";
import runGame from "./gameRunner";

export interface SimulationResult {
  winPercentage: number;
  totalWin: number;
  maxLoss: number;
  sampleTotleWin: Map<number, number>;
  simulationTime: number;
}

export class Simulator {
  public progressPercent: number = 0;

  public constructor() {}

  public startSimulation(
    totalGame: number,
    cutOff: number,
    numberOfDecks: number,
    actionStrategy: ActionStrategy,
    runningCountStrategy: RunningCountStrategy
  ): Promise<SimulationResult> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const cards = new CardDistributor(cutOff, numberOfDecks);
      cards.shuffle();
      let totalWin = 0;
      let maxLoss = 0;
      let i = 0;
      const batchSize = 1000; // Number of games to run in each batch
      const sampleTotleWin = new Map<number, number>();

      const runBatch = () => {
        const end = Math.min(i + batchSize, totalGame);
        sampleTotleWin.set(i, totalWin);
        for (; i < end; i++) {
          const basebet = cards.getRunningCount() >= 100 ? 2 : 1;
          const game = runGame(cards, actionStrategy, basebet);
          totalWin += game.playerWin;
          maxLoss = Math.min(maxLoss, totalWin);
          if (i % Math.floor(totalGame / 100) === 0) {
            this.progressPercent = Math.floor((i / totalGame) * 100);
          }
        }

        if (i < totalGame) {
          setTimeout(runBatch, 0); // Schedule the next batch
        } else {
          const winPercentage = (totalWin / totalGame) * 100;
          resolve({
            winPercentage,
            totalWin,
            maxLoss,
            sampleTotleWin,
            simulationTime: Date.now() - startTime,
          });
        }
      };

      runBatch(); // Start the first batch
    });
  }

  public getProgress(): number {
    return this.progressPercent;
  }
}
