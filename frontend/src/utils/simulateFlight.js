export function simulateFlight(v0, theta, options = {}) {
  const dt = options.dt ?? 0.02;
  const g = options.g ?? 9.81;

  const points = [];
  let t = 0;
  while (true) {
    const x = v0 * Math.cos(theta) * t;
    const y = v0 * Math.sin(theta) * t - 0.5 * g * t * t;
    if (y < 0 && t > 0) break;
    points.push({ x, y });
    t += dt;
  }

  return points;
}
