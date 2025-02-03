import React, { useState } from "react";
import { BlackjackAction } from "../model/BlackjackAction";

type Strategy = BlackjackAction[][];

const initialStrategy: Strategy = Array.from({ length: 18 }, () =>
  Array(10).fill(BlackjackAction.Stand)
);

function StrategyChartConfigurator() {
  const [strategy, setStrategy] = useState<Strategy>(initialStrategy);

  const handleActionChange = (
    row: number,
    col: number,
    action: BlackjackAction
  ) => {
    const newStrategy = strategy.map((r, i) =>
      r.map((a, j) => (i === row && j === col ? action : a))
    );
    setStrategy(newStrategy);
  };

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
          {strategy.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                {rowIndex < 10
                  ? `Sum ${rowIndex + 8}`
                  : rowIndex < 18
                  ? `Soft ${rowIndex - 2}`
                  : `Pair ${rowIndex - 18}`}
              </td>
              {row.map((action, colIndex) => (
                <td key={colIndex}>
                  <select
                    value={action}
                    onChange={(e) =>
                      handleActionChange(
                        rowIndex,
                        colIndex,
                        e.target.value as BlackjackAction
                      )
                    }
                  >
                    <option value={BlackjackAction.Hit}>Hit</option>
                    <option value={BlackjackAction.Stand}>Stand</option>
                    <option value={BlackjackAction.Double}>Double</option>
                    <option value={BlackjackAction.Split}>Split</option>
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StrategyChartConfigurator;
