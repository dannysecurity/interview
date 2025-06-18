import React, { useState } from 'react';

function InputForm({ onStart }) {
  const [speed, setSpeed] = useState('');
  const [angle, setAngle] = useState('');
  const [spin, setSpin] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const speedVal = parseFloat(speed);
    const angleVal = parseFloat(angle);
    const spinVal = parseFloat(spin);

    if (isNaN(speedVal) || speedVal <= 0) {
      newErrors.speed = 'Speed must be greater than 0';
    }
    if (isNaN(angleVal) || angleVal < 0 || angleVal > 90) {
      newErrors.angle = 'Angle must be between 0 and 90';
    }
    if (isNaN(spinVal) || spinVal < 0) {
      newErrors.spin = 'Spin must be 0 or greater';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onStart({ speed: parseFloat(speed), angle: parseFloat(angle), spin: parseFloat(spin) });
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
      <div>
        <label>
          Backspin (rpm):
          <input
            type="number"
            value={spin}
            onChange={(e) => setSpin(e.target.value)}
          />
        </label>
        {errors.spin && <span className="error">{errors.spin}</span>}
      </div>
      <button type="submit">Start Simulation</button>
    </form>
  );
}

export default InputForm;
