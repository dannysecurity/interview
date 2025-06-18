# Interview Example

This repository includes a simple `FlightCanvas` React component used to animate a golf ball flight path on an HTML canvas.

## FlightCanvas Usage

```
import FlightCanvas from './src/FlightCanvas';

const trajectory = [
  { x: 0, y: 0 },
  { x: 10, y: 5 },
  { x: 20, y: 8 },
  // ...more points
];

<FlightCanvas trajectory={trajectory} width={800} height={400} />
```

The component uses `requestAnimationFrame` to render each point in the `trajectory` array sequentially, drawing both the ball and its trail on a canvas element.

When the `trajectory` prop changes, any existing animation is canceled and the canvas is cleared before starting a new one.
