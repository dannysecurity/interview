import React, { useState } from 'react';
import InputForm from './components/InputForm';
import FlightCanvas from './FlightCanvas';
import { simulateFlight } from './utils/simulateFlight';
import './App.css';

function App() {
  const [simulationData, setSimulationData] = useState(null);
  const [trajectory, setTrajectory] = useState([]);

  const handleStart = ({ speed, angle }) => {
    const theta = (angle * Math.PI) / 180;
    const points = simulateFlight(speed, theta);
    setTrajectory(points.map(({ x, y }) => ({ x, y })));
    setSimulationData({ speed, angle });
  };

  return (
    <div className="App">
      <h1>Projectile Simulator</h1>
      <InputForm onStart={handleStart} />
      {simulationData && (
        <div data-testid="output">
          <p>Speed: {simulationData.speed}</p>
          <p>Angle: {simulationData.angle}</p>
          <FlightCanvas trajectory={trajectory} width={600} height={300} />
        </div>
      )}
    </div>
  );
}

export default App;
