const { simulateFlight } = require('./simulateFlight');

// Example usage
const data = simulateFlight(20, Math.PI / 4, { spin: 3000 }); // 20 m/s at 45° with 3000 rpm backspin
console.log(data);
