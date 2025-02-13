import { useEffect, useState, useRef } from "react";
import { Simulator } from "../service/simulator";
import StrategyChartConfigurator from "./StrategyChartConfigurator";
import {
  ActionStrategy,
  defaultBlackjackStrategy,
  defaultPairStrategy,
  defaultSoftHandStrategy,
} from "../model/ActionStrategy";
import { RunningCountStrategy } from "../model/RunningCountStrategy";
// import RunningCountConfigurator from "./RunningCountConfigurator";

function GameSimulator() {
  const [numOfGames, setNumOfGames] = useState(10);
  const [numOfDecks, setNumOfDecks] = useState(4);
  const [cutOffRatio, setCutOffRatio] = useState(0.75);
  const [progress, setProgress] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [simulator, setSimulator] = useState<Simulator | null>(null);
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);
  const [runningCountStrategy, setRunningCountStrategy] =
    useState<RunningCountStrategy>(new RunningCountStrategy());
  const [hardStrategy, setHardStrategy] = useState<string[][]>(
    defaultBlackjackStrategy
  );
  const [softStrategy, setSoftStrategy] = useState<string[][]>(
    defaultSoftHandStrategy
  );
  const [pairStrategy, setPairStrategy] =
    useState<string[][]>(defaultPairStrategy);
  const [isConfiguratorVisible, setIsConfiguratorVisible] = useState(false);
  const configuratorRef = useRef<HTMLDivElement>(null);

  const runSimulation = async () => {
    setIsGameRunning(true);
    console.log("Starting a game");
    const simulator = new Simulator();
    setSimulator(simulator);
    const actionStrategy = new ActionStrategy(
      hardStrategy,
      softStrategy,
      pairStrategy
    );
    const result = await simulator.startSimulation(
      numOfGames,
      cutOffRatio,
      numOfDecks,
      actionStrategy,
      runningCountStrategy
    );
    setSimulationResult(result);
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

  const toggleConfigurator = () => {
    setIsConfiguratorVisible(!isConfiguratorVisible);
  };

  useEffect(() => {
    if (configuratorRef.current) {
      const element = configuratorRef.current;
      if (isConfiguratorVisible) {
        element.style.height = `${element.scrollHeight}px`;
        element.style.opacity = "1";
      } else {
        element.style.height = "0";
        element.style.opacity = "0";
      }
    }
  }, [isConfiguratorVisible]);

  return (
    <div>
      <h1>Blackjack Simulator</h1>
      <button onClick={toggleConfigurator} style={buttonStyle}>
        {isConfiguratorVisible ? "Hide Configurator" : "Show Configurator"}
      </button>
      <div
        ref={configuratorRef}
        style={{
          overflow: "hidden",
          transition: "height 0.5s ease, opacity 0.5s ease",
        }}
      >
        <StrategyChartConfigurator
          hardStrategy={hardStrategy}
          setHardStrategy={setHardStrategy}
          softStrategy={softStrategy}
          setSoftStrategy={setSoftStrategy}
          pairStrategy={pairStrategy}
          setPairStrategy={setPairStrategy}
        />
      </div>
      {/* <RunningCountConfigurator
        runningCountStrategy={runningCountStrategy}
        setRunningCountStrategy={setRunningCountStrategy}
      /> */}
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
      {simulationResult !== null && (
        <div>
          <div>Win rate: {simulationResult.winPercentage.toFixed(2)}%</div>
          <div>Total Win: {simulationResult.totalWin}</div>
          <div>Max Loss: {simulationResult.maxLoss}</div>
        </div>
      )}
    </div>
  );
}

export default GameSimulator;
