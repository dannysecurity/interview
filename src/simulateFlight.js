/**
 * Simulate the flight of a projectile using basic physics equations.
 *
 * @param {number} v0 - Initial velocity magnitude (m/s)
 * @param {number} theta - Launch angle in radians
 * @param {object} [options]
 * @param {number} [options.dt=0.01] - Time step in seconds
 * @param {number} [options.g=9.81] - Gravitational acceleration (m/s^2)
 * @returns {Array<{t:number,x:number,y:number}>} Array of simulation points
 */
function simulateFlight(v0, theta, options = {}) {
  const dt = options.dt ?? 0.01;
  const g = options.g ?? 9.81;
  const spin = options.spin ?? 0;

  const magnusCoeff = 0.0004;
  const spinRps = spin / 60; // rpm -> revolutions per second

  let vx = v0 * Math.cos(theta);
  let vy = v0 * Math.sin(theta);

  let x = 0;
  let y = 0;
  let t = 0;
  const points = [];

  while (true) {
    points.push({ t, x, y });
    if (y <= 0 && t > 0) break;

    // Magnus acceleration based on current velocity
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

module.exports = { simulateFlight };
