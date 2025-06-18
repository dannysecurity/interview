export function simulateFlight(v0, theta, options = {}) {
  const dt = options.dt ?? 0.02;
  const g = options.g ?? 9.81;
  const spin = options.spin ?? 0;

  const vx = v0 * Math.cos(theta);
  const spinRps = spin / 60;
  const liftCoeff = 0.0004;
  const aLift = liftCoeff * spinRps * vx;

  const points = [];
  let t = 0;
  while (true) {
    const x = vx * t;
    const y = v0 * Math.sin(theta) * t + 0.5 * aLift * t * t - 0.5 * g * t * t;
    if (y < 0 && t > 0) break;
    points.push({ x, y });
    t += dt;
  }

  return points;
}
