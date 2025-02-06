import React from "react";
import { RunningCountStrategy } from "../model/RunningCountStrategy";

interface RunningCountConfiguratorProps {
  runningCountStrategy: RunningCountStrategy;
  setRunningCountStrategy: React.Dispatch<
    React.SetStateAction<RunningCountStrategy>
  >;
}

const RunningCountConfigurator: React.FC<RunningCountConfiguratorProps> = ({
  runningCountStrategy,
  setRunningCountStrategy,
}) => {
  // Function to update the running count
  const updateRunningCount = (value: number, increment: boolean) => {
    setRunningCountStrategy((prevStrategy) => {
      const newStrategy = new RunningCountStrategy(
        new Map(prevStrategy.strategy)
      );
      const currentRunningCount = newStrategy.getBaseBet(value);
      const newRunningCount = Math.max(
        1,
        currentRunningCount + (increment ? 1 : -1)
      );

      // Update the current value's running count
      newStrategy.updateStrategy(value, newRunningCount);

      // Adjust all values greater than the current value
      for (let i = value + 1; i <= 20; i++) {
        if (newStrategy.getBaseBet(i) < newRunningCount) {
          newStrategy.updateStrategy(i, newRunningCount);
        }
      }

      // Adjust all values less than the current value
      for (let i = -20; i < value; i++) {
        if (newStrategy.getBaseBet(i) > newRunningCount) {
          newStrategy.updateStrategy(i, newRunningCount);
        }
      }

      return newStrategy;
    });
  };

  return (
    <div style={{ display: "flex", overflowX: "auto", width: "100%" }}>
      {Array.from(runningCountStrategy.strategy.entries()).map(
        ([value, runningCount]) => (
          <div key={value} style={{ margin: "0 2px", textAlign: "center" }}>
            <button onClick={() => updateRunningCount(value, true)}>+</button>
            <div>
              <span>{value}</span>
              <br />
              <span>{runningCount}</span>
            </div>
            <button onClick={() => updateRunningCount(value, false)}>-</button>
          </div>
        )
      )}
    </div>
  );
};

export default RunningCountConfigurator;
