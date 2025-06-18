import React, { useState } from 'react';

function InputForm({ onStart }) {
  const [speed, setSpeed] = useState('');
  const [angle, setAngle] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const speedVal = parseFloat(speed);
    const angleVal = parseFloat(angle);

    if (isNaN(speedVal) || speedVal <= 0) {
      newErrors.speed = 'Speed must be greater than 0';
    }
    if (isNaN(angleVal) || angleVal < 0 || angleVal > 90) {
      newErrors.angle = 'Angle must be between 0 and 90';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onStart({ speed: parseFloat(speed), angle: parseFloat(angle) });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Speed (m/s):
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
        </label>
        {errors.speed && <span className="error">{errors.speed}</span>}
      </div>
      <div>
        <label>
          Angle (degrees):
          <input
            type="number"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
          />
        </label>
        {errors.angle && <span className="error">{errors.angle}</span>}
      </div>
      <button type="submit">Start Simulation</button>
    </form>
  );
}

export default InputForm;
