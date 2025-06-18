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
      <div className="card">
        <h1>Projectile Simulator</h1>
        <InputForm onStart={handleStart} />
        {simulationData && (
          <>
            <div data-testid="output">
              <p>Speed: {simulationData.speed} m/s</p>
              <p>Angle: {simulationData.angle}°</p>
              <p style={{ fontSize: '0.95rem', color: '#4a4e69', marginTop: '0.5rem' }}>
                Distances are shown in <b>yards</b>.
              </p>
              <p style={{ fontWeight: 600, marginTop: '1rem' }}>
                Final Distance: {trajectory.length > 0 ? (Math.max(...trajectory.map(({x}) => x)) * 1.09361).toFixed(2) : '0.00'} yards
              </p>
              <p style={{ fontWeight: 600, marginTop: '0.5rem' }}>
                Hangtime: {trajectory.length > 1 ? ((trajectory.length - 1) * 0.02).toFixed(2) : '0.00'} seconds
              </p>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
              <FlightCanvas trajectory={trajectory.map(({x, y}) => ({ x: x * 1.09361, y: y * 1.09361 }))} width={500} height={300} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
