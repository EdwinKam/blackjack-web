export class RunningCountStrategy {
  public strategy: Map<number, number> = new Map<number, number>();

  constructor(strategy?: Map<number, number>) {
    if (strategy) {
      this.strategy = strategy;
    } else {
      this.strategy = new Map<number, number>();
      for (let i = -20; i <= 20; i++) {
        this.strategy.set(i, 1);
      }
    }
  }

  public getBaseBet(runningCount: number): number {
    if (runningCount < -20) {
      return this.strategy.get(-20) as number;
    } else if (runningCount > 20) {
      return this.strategy.get(20) as number;
    } else {
      return this.strategy.get(runningCount) as number;
    }
  }

  public updateStrategy(value: number, runningCount: number) {
    this.strategy.set(value, runningCount);
  }
}
