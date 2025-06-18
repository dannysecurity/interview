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

    </div>
  );
}

export default App;
