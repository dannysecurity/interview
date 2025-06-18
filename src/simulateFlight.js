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

  const points = [];
  let t = 0;
  while (true) {
    const x = v0 * Math.cos(theta) * t;
    const y = v0 * Math.sin(theta) * t - 0.5 * g * t * t;
    points.push({ t, x, y });
    if (y <= 0 && t > 0) {
      break;
    }
    t += dt;
  }

  return points;
}

module.exports = { simulateFlight };
