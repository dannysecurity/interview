import React, { useRef, useEffect } from 'react';

/**
 * FlightCanvas component
 * Props:
 * - trajectory: Array of { x: number, y: number } positions in meters
 * - width: width of canvas in pixels
 * - height: height of canvas in pixels
 */
function FlightCanvas({ trajectory = [], width = 500, height = 300 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const convert = (pos) => {
    const maxX = Math.max(...trajectory.map((p) => p.x), 1);
    const maxY = Math.max(...trajectory.map((p) => p.y), 1);
    return {
      x: (pos.x / maxX) * width,
      y: height - (pos.y / maxY) * height,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    const draw = () => {
      if (frame >= trajectory.length) return;
      const pos = convert(trajectory[frame]);

      if (frame === 0) {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      } else {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }

      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      frame += 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    ctx.clearRect(0, 0, width, height);
    frame = 0;
    animationRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animationRef.current);
  }, [trajectory, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export default FlightCanvas;
