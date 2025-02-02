import { useState } from "react";
import startSimulation from "../service/simulator";

function GameSimulator() {
  const [numOfGames, setNumOfGames] = useState(1000);
  const [numOfDecks, setNumOfDecks] = useState(4);
  const [cutOffRatio, setCutOffRatio] = useState(0.75);

  const runSimulation = () => {
    // Placeholder for simulation logic
    startSimulation(numOfGames, cutOffRatio, numOfDecks);
  };

  return (
    <div>
      <h1>Blackjack Simulator</h1>
      <div>
        <label htmlFor="numOfGames">Number of Games:</label>
        <input
          type="number"
          id="numOfGames"
          name="numOfGames"
          value={numOfGames}
          onChange={(e) => setNumOfGames(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="numOfDecks">Number of Decks:</label>
        <input
          type="number"
          id="numOfDecks"
          name="numOfDecks"
          value={numOfDecks}
          onChange={(e) => setNumOfDecks(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="cutOffRatio">Cut-off Ratio:</label>
        <input
          type="number"
          id="cutOffRatio"
          name="cutOffRatio"
          step="0.01"
          value={cutOffRatio}
          onChange={(e) => setCutOffRatio(Number(e.target.value))}
        />
      </div>
      <button onClick={runSimulation}>Start Simulation</button>
    </div>
  );
}

export default GameSimulator;
