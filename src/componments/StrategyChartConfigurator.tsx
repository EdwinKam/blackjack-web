import React, { useEffect, useState } from "react";
import { BlackjackAction } from "../model/BlackjackAction";
import {
  defaultBlackjackStrategy,
  defaultPairStrategy,
  defaultSoftHandStrategy,
} from "../model/ActionStrategy";

function StrategyChartConfigurator() {
  const [hardStrategy, setHardStrategy] = useState<string[][]>(
    defaultBlackjackStrategy
  );
  const [softStrategy, setSoftStrategy] = useState<string[][]>(
    defaultSoftHandStrategy
  );
  const [pairStrategy, setPairStrategy] =
    useState<string[][]>(defaultPairStrategy);

  useEffect(() => {
    console.log("hardStrategy", hardStrategy);
    console.log("softStrategy", softStrategy);
    console.log("pairStrategy", pairStrategy);
  }, [hardStrategy, softStrategy, pairStrategy]);

  const handleActionChange = (
    strategyType: "hard" | "soft" | "pair",
    row: number,
    col: number,
    action: string
  ) => {
    const updateStrategy = (
      strategy: string[][],
      setStrategy: React.Dispatch<React.SetStateAction<string[][]>>
    ) => {
      const newStrategy = strategy.map((r, i) =>
        r.map((a, j) => (i === row && j === col ? action : a))
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
            <select
              value={action}
              onChange={(e) =>
                handleActionChange(
                  strategyType,
                  rowIndex,
                  colIndex,
                  e.target.value
                )
              }
            >
              <option value="H">H</option>
              <option value="S">S</option>
              <option value="D">D</option>
              <option value="P">P</option>
            </select>
          </td>
        ))}
      </tr>
    ));

  return (
    <div>
      <h2>Strategy Chart Configurator</h2>
      <table>
        <thead>
          <tr>
            <th>Player\Dealer</th>
            {[...Array(10)].map((_, i) => (
              <th key={i}>{i + 1}</th>
            ))}
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
