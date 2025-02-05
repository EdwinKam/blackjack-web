export class RunningCountStrategy {
  public strategy: Map<number, number> = new Map<number, number>();

  public static defaultRunningCountStrategy: Map<number, number> = new Map<
    number,
    number
  >(Array.from({ length: 41 }, (_, i) => [i - 20, 1]));

  public constructor(
    strategy: Map<
      number,
      number
    > = RunningCountStrategy.defaultRunningCountStrategy
  ) {
    this.strategy = strategy;
  }

  public getBaseBet(runningCount: number): number {
    if (this.strategy.get(runningCount) === undefined) {
      throw new Error(`Invalid running count: ${runningCount}`);
    }
    return this.strategy.get(runningCount) as number;
  }
}
