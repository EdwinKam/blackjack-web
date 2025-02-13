import { ActionStrategy } from "../model/ActionStrategy";
import { CardDistributor } from "../model/CardDistributor";
import { RunningCountStrategy } from "../model/RunningCountStrategy";
import { logger } from "../util/logger";
import runGame from "./gameRunner";

export interface SimulationResult {
  winPercentage: number;
  totalWin: number;
  maxLoss: number;
  maxWin: number;
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
      let maxWin = 0;
      let i = 0;
      const batchSize = 1000; // Number of games to run in each batch
      const sampleTotleWin = new Map<number, number>();

      const runBatch = () => {
        const end = Math.min(i + batchSize, totalGame);
        sampleTotleWin.set(i, totalWin);
        for (; i < end; i++) {
          if (totalGame < 10000) {
            sampleTotleWin.set(i, totalWin);
          }
          let basebet = 1;
          if (cards.getAdjustedRunningCount() > 1) {
            basebet = 1.1;
          } else if (cards.getAdjustedRunningCount() >= 3) {
            basebet = 1.5;
          } else if (cards.getAdjustedRunningCount() >= 5) {
            basebet = 2;
          }
          const game = runGame(cards, actionStrategy, basebet);
          totalWin += game.playerWin;
          logger("basebet: " + basebet + " | total win: " + totalWin);
          maxLoss = Math.min(maxLoss, totalWin);
          maxWin = Math.max(maxWin, totalWin);
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
            maxWin,
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
