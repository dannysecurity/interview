export function simulateFlight(v0, theta, options = {}) {
  const dt = options.dt ?? 0.02;
  const g = options.g ?? 9.81;
  const spin = options.spin ?? 0;

  const magnusCoeff = 0.0004;
  const spinRps = spin / 60;

  let vx = v0 * Math.cos(theta);
  let vy = v0 * Math.sin(theta);

  let x = 0;
  let y = 0;
  let t = 0;
  const points = [];

  while (true) {
    points.push({ x, y });
    if (y < 0 && t > 0) break;

    const aMagnusX = -magnusCoeff * spinRps * vy;
    const aMagnusY = magnusCoeff * spinRps * vx;

    vx += aMagnusX * dt;
    vy += (aMagnusY - g) * dt;

    x += vx * dt;
    y += vy * dt;
    t += dt;
  }

  return points;
}
