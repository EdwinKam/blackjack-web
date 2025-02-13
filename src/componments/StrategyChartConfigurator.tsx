import React, { useEffect } from "react";

function StrategyChartConfigurator({
  hardStrategy,
  softStrategy,
  pairStrategy,
  setHardStrategy,
  setSoftStrategy,
  setPairStrategy,
}: {
  hardStrategy: string[][];
  softStrategy: string[][];
  pairStrategy: string[][];
  setHardStrategy: React.Dispatch<React.SetStateAction<string[][]>>;
  setSoftStrategy: React.Dispatch<React.SetStateAction<string[][]>>;
  setPairStrategy: React.Dispatch<React.SetStateAction<string[][]>>;
}) {
  useEffect(() => {
    // console.log("hardStrategy", hardStrategy);
    // console.log("softStrategy", softStrategy);
    // console.log("pairStrategy", pairStrategy);
  }, [hardStrategy, softStrategy, pairStrategy]);

  const actionSequence: string[] = ["H", "S", "D", "P"];

  const getNextAction = (currentAction: string): string => {
    const currentIndex = actionSequence.indexOf(currentAction);
    return actionSequence[(currentIndex + 1) % actionSequence.length];
  };

  const handleActionChange = (
    strategyType: "hard" | "soft" | "pair",
    row: number,
    col: number
  ) => {
    const updateStrategy = (
      strategy: string[][],
      setStrategy: React.Dispatch<React.SetStateAction<string[][]>>
    ) => {
      const newStrategy = strategy.map((r, i) =>
        r.map((a, j) => (i === row && j === col ? getNextAction(a) : a))
      );
      setStrategy(newStrategy);
    };

    if (strategyType === "hard") {
      updateStrategy(hardStrategy, setHardStrategy);
    } else if (strategyType === "soft") {
      updateStrategy(softStrategy, setSoftStrategy);
    } else if (strategyType === "pair") {
      updateStrategy(pairStrategy, setPairStrategy);
    }
  };

  const getButtonStyle = (action: string) => {
    switch (action) {
      case "H":
        return { backgroundColor: "lightgreen" };
      case "S":
        return { backgroundColor: "lightcoral" };
      case "D":
        return { backgroundColor: "yellow" };
      case "P":
        return { backgroundColor: "plum" };
      default:
        return {};
    }
  };

  const renderStrategyRows = (
    strategy: string[][],
    labelPrefix: string,
    strategyType: "hard" | "soft" | "pair"
  ) =>
    strategy.map((row, rowIndex) => (
      <tr key={`${labelPrefix}-${rowIndex}`}>
        <td>
          {labelPrefix === "Sum"
            ? `${rowIndex + 8}`
            : labelPrefix === "Soft"
            ? `A${rowIndex + 2}`
            : `${rowIndex + 1},${rowIndex + 1}`}
        </td>
        {row.map((action, colIndex) => (
          <td key={colIndex}>
            <button
              onClick={() =>
                handleActionChange(strategyType, rowIndex, colIndex)
              }
              style={{
                ...getButtonStyle(action),
                borderRadius: "5px",
                padding: "10px",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.1s ease-in-out",
                width: "100%", // Make button fill the cell
                minWidth: "40px", // Ensure a minimum width for tap targets
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {action}
            </button>
          </td>
        ))}
      </tr>
    ));

  return (
    <div style={{ overflowX: "auto" }}>
      <h2>Strategy Chart Configurator</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>P\D</th>
            {[...Array(9)].map((_, i) => (
              <th key={i}>{i + 2}</th> // Dealer cards 2 through 10
            ))}
            <th>A</th>
          </tr>
        </thead>
        <tbody>
          {renderStrategyRows(hardStrategy, "Sum", "hard")}
          {renderStrategyRows(softStrategy, "Soft", "soft")}
          {renderStrategyRows(pairStrategy, "Pair", "pair")}
        </tbody>
      </table>
    </div>
  );
}

export default StrategyChartConfigurator;
