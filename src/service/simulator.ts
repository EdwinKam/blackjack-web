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
  runningCountWinTotal: Map<number, number>;
  runningCountGameCount: Map<number, number>;
  strategyDescription?: string;
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
      const runningCountWinTotal = new Map<number, number>();
      const runningCountLossTotal = new Map<number, number>();
      const runningCountGameCount = new Map<number, number>();
      let strategyDescription = "";

      const runBatch = () => {
        const end = Math.min(i + batchSize, totalGame);
        sampleTotleWin.set(i, totalWin); // only record every 1000 games
        for (; i < end; i++) {
          cards.ifCutCardReachedThenShuffle();
          if (totalGame < 10000) {
            sampleTotleWin.set(i, totalWin);
          }
          let basebet = 1;
          strategyDescription =
            "adjusted running count > 0 then $1, > 2 then $3";
          if (cards.getAdjustedRunningCount() > 0) {
            basebet = 2;
          }
          if (cards.getAdjustedRunningCount() > 2) {
            basebet = 3;
          }
          const preGameRunningCount = cards.getAdjustedRunningCount();
          logger("start game");
          logger(
            "running count: " +
              cards.getRunningCount() +
              " | adjusted running count: " +
              cards.getAdjustedRunningCount() +
              " | card remaining: " +
              cards.getRemainingCard() +
              " | basebet: " +
              basebet
          );
          const game = runGame(cards, actionStrategy, basebet);
          totalWin += game.playerWin;

          // Update win rate and game count
          const currentWinRate =
            runningCountWinTotal.get(preGameRunningCount) || 0;
          runningCountWinTotal.set(
            preGameRunningCount,
            currentWinRate + (game.playerWin > 0 ? 1 : 0)
          );

          const currentLossRate =
            runningCountLossTotal.get(preGameRunningCount) || 0;
          runningCountLossTotal.set(
            preGameRunningCount,
            currentLossRate + (game.playerWin < 0 ? 1 : 0)
          );

          const currentGameCount =
            runningCountGameCount.get(preGameRunningCount) || 0;
          runningCountGameCount.set(
            preGameRunningCount,
            currentGameCount + (game.playerWin != 0 ? 1 : 0) // dont count tie
          );
          // console.log("wintotal", runningCountWinTotal);
          // console.log("losstotal", runningCountLossTotal);
          // console.log("toal", runningCountGameCount);
          logger("playerHand" + game.playerHand.toString());
          logger("dealerHand" + game.dealerHand.toString());
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
            runningCountWinTotal,
            runningCountGameCount,
            strategyDescription,
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
