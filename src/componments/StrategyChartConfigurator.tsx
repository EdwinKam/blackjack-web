import React, { useState } from "react";
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

  const renderStrategyTable = (strategy: string[][], labelPrefix: string) => (
    <table>
      {labelPrefix === "Sum" && (
        <thead>
          <tr>
            <th>Player\Dealer</th>
            {[...Array(10)].map((_, i) => (
              <th key={i}>{i + 1}</th>
            ))}
          </tr>
        </thead>
      )}

      <tbody>
        {strategy.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td>
              {labelPrefix === "Sum"
                ? `${rowIndex + 8}`
                : labelPrefix === "Soft"
                ? `A${rowIndex + 2}`
                : `${rowIndex + 1},${rowIndex + 1}`}{" "}
            </td>
            {row.map((action, colIndex) => (
              <td key={colIndex}>
                <select value={action} disabled>
                  <option value={BlackjackAction.Hit}>H</option>
                  <option value={BlackjackAction.Stand}>S</option>
                  <option value={BlackjackAction.Double}>D</option>
                  <option value={BlackjackAction.Split}>P</option>
                </select>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <h2>Strategy Chart Configurator</h2>
      <h3>Hard Totals</h3>
      {renderStrategyTable(hardStrategy, "Sum")}
      {renderStrategyTable(softStrategy, "Soft")}
      {renderStrategyTable(pairStrategy, "Pair")}
    </div>
  );
}

export default StrategyChartConfigurator;
