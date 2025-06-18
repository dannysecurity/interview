import React, { useState } from 'react';
import InputForm from './components/InputForm';
import './App.css';

function App() {
  const [simulationData, setSimulationData] = useState(null);

  const handleStart = ({ speed, angle }) => {
    // Placeholder for physics calculations
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
        </div>
      )}
    </div>
  );
}

export default App;
