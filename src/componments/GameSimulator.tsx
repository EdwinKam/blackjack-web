import { useEffect, useState } from "react";
import { Simulator } from "../service/simulator";

function GameSimulator() {
  const [numOfGames, setNumOfGames] = useState(10000);
  const [numOfDecks, setNumOfDecks] = useState(4);
  const [cutOffRatio, setCutOffRatio] = useState(0.75);
  const [progress, setProgress] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [simulator, setSimulator] = useState<Simulator | null>(null);

  const runSimulation = async () => {
    setIsGameRunning(true);
    console.log("Starting a game");
    const newSimulator = new Simulator();
    setSimulator(newSimulator);
    await newSimulator.startSimulation(numOfGames, cutOffRatio, numOfDecks);
    setIsGameRunning(false);
  };

  useEffect(() => {
    if (isGameRunning && simulator) {
      const updateProgress = () => {
        setProgress(simulator.progressPercent);
        if (simulator.progressPercent < 100) {
          requestAnimationFrame(updateProgress);
        }
      };
      updateProgress();
    }
  }, [isGameRunning, simulator]);

  const incrementGames = () => {
    setNumOfGames((prev) => Math.min(100000000, prev + 100000));
  };

  const decrementGames = () => {
    setNumOfGames((prev) => Math.max(10000, prev - 100000));
  };

  const incrementDecks = () => {
    setNumOfDecks((prev) => Math.min(10, prev + 1));
  };

  const decrementDecks = () => {
    setNumOfDecks((prev) => Math.max(1, prev - 1));
  };

  const incrementCutOffRatio = () => {
    setCutOffRatio((prev) => parseFloat(Math.min(1, prev + 0.05).toFixed(2)));
  };

  const decrementCutOffRatio = () => {
    setCutOffRatio((prev) =>
      parseFloat(Math.max(0.05, prev - 0.05).toFixed(2))
    );
  };

  const buttonStyle = {
    margin: "0 5px",
    padding: "5px 10px",
    fontSize: "16px",
    cursor: "pointer",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  };

  return (
    <div>
      <h1>Blackjack Simulator</h1>
      <div style={containerStyle}>
        <label htmlFor="numOfGames">Number of Games:</label>
        <button onClick={decrementGames} style={buttonStyle}>
          -
        </button>
        <span>{numOfGames}</span>
        <button onClick={incrementGames} style={buttonStyle}>
          +
        </button>
      </div>
      <div style={containerStyle}>
        <label htmlFor="numOfDecks">Number of Decks:</label>
        <button onClick={decrementDecks} style={buttonStyle}>
          -
        </button>
        <span>{numOfDecks}</span>
        <button onClick={incrementDecks} style={buttonStyle}>
          +
        </button>
      </div>
      <div style={containerStyle}>
        <label htmlFor="cutOffRatio">Cut-off Ratio:</label>
        <button onClick={decrementCutOffRatio} style={buttonStyle}>
          -
        </button>
        <span>{cutOffRatio.toFixed(2)}</span>
        <button onClick={incrementCutOffRatio} style={buttonStyle}>
          +
        </button>
      </div>
      <button onClick={runSimulation} style={buttonStyle}>
        Start Simulation
      </button>
      {isGameRunning && <div>Progress: {progress.toFixed(2)}%</div>}
    </div>
  );
}

export default GameSimulator;
