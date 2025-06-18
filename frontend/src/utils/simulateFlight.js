export function simulateFlight(v0, theta, options = {}) {
  const dt = options.dt ?? 0.02;
  const g = options.g ?? 9.81;
  const spin = options.spin ?? 3000; // RPM, typical backspin for a golf drive

  // Physical constants
  const mass = 0.0459; // kg (golf ball)
  const radius = 0.02135; // m
  const area = Math.PI * radius * radius; // cross-sectional area
  const rho = 1.225; // air density (kg/m^3)

  // Convert spin to rad/s
  const omega = (spin * 2 * Math.PI) / 60;

  let vx = v0 * Math.cos(theta);
  let vy = v0 * Math.sin(theta);

  let x = 0;
  let y = 0;
  let t = 0;
  const points = [];

  while (true) {
    points.push({ x, y });
    if (y < 0 && t > 0) break;

    const v = Math.sqrt(vx * vx + vy * vy) || 1e-8;
    // Empirical lift coefficient for Magnus effect
    const CL = 0.6 * (radius * omega) / v;
    // Magnus force magnitude
    const Fm = 0.5 * CL * rho * area * v * v;
    // Magnus acceleration components (perpendicular to velocity)
    const aMagnusX = (Fm / mass) * (-vy / v);
    const aMagnusY = (Fm / mass) * (vx / v);

    vx += aMagnusX * dt;
    vy += (aMagnusY - g) * dt;

    x += vx * dt;
    y += vy * dt;
    t += dt;
  }

  return points;
}
