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

  // Padding for axes and labels
  const PADDING_LEFT = 50;
  const PADDING_BOTTOM = 40;
  const PADDING_TOP = 20;
  const PADDING_RIGHT = 20;

  // Find max values for scaling and ticks
  const maxX = Math.max(...trajectory.map((p) => p.x), 1);
  const maxY = Math.max(...trajectory.map((p) => p.y), 1);

  // Helper to round up to a nice tick interval
  function niceTick(max, ticks = 5) {
    const raw = max / ticks;
    const pow10 = Math.pow(10, Math.floor(Math.log10(raw)));
    return Math.ceil(raw / pow10) * pow10;
  }
  const xTick = niceTick(maxX);
  const yTick = niceTick(maxY);

  // Convert world coords to canvas coords
  const convert = (pos) => {
    return {
      x: PADDING_LEFT + (pos.x / maxX) * (width - PADDING_LEFT - PADDING_RIGHT),
      y: height - PADDING_BOTTOM - (pos.y / maxY) * (height - PADDING_TOP - PADDING_BOTTOM),
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    // Clear and draw background
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.fillStyle = '#f6f7ff';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // Draw axes
    ctx.save();
    ctx.strokeStyle = '#bfc9d1';
    ctx.lineWidth = 2;
    // x-axis
    ctx.beginPath();
    ctx.moveTo(PADDING_LEFT, height - PADDING_BOTTOM);
    ctx.lineTo(width - PADDING_RIGHT, height - PADDING_BOTTOM);
    ctx.stroke();
    // y-axis
    ctx.beginPath();
    ctx.moveTo(PADDING_LEFT, height - PADDING_BOTTOM);
    ctx.lineTo(PADDING_LEFT, PADDING_TOP);
    ctx.stroke();
    ctx.restore();

    // Draw axis ticks and labels
    ctx.save();
    ctx.font = '13px Arial';
    ctx.fillStyle = '#4a4e69';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    // x-axis ticks
    for (let x = 0; x <= maxX; x += xTick) {
      const px = PADDING_LEFT + (x / maxX) * (width - PADDING_LEFT - PADDING_RIGHT);
      ctx.beginPath();
      ctx.moveTo(px, height - PADDING_BOTTOM);
      ctx.lineTo(px, height - PADDING_BOTTOM + 8);
      ctx.strokeStyle = '#bfc9d1';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillText(Math.round(x), px, height - PADDING_BOTTOM + 12);
    }
    // y-axis ticks
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = 0; y <= maxY; y += yTick) {
      const py = height - PADDING_BOTTOM - (y / maxY) * (height - PADDING_TOP - PADDING_BOTTOM);
      ctx.beginPath();
      ctx.moveTo(PADDING_LEFT, py);
      ctx.lineTo(PADDING_LEFT - 8, py);
      ctx.strokeStyle = '#bfc9d1';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillText(Math.round(y), PADDING_LEFT - 12, py);
    }
    ctx.restore();

    // Axis labels
    ctx.save();
    ctx.font = '15px Arial';
    ctx.fillStyle = '#4a4e69';
    // x-axis label
    ctx.textAlign = 'center';
    ctx.fillText('Yards', (width + PADDING_LEFT - PADDING_RIGHT) / 2, height - 5);
    // y-axis label (rotated)
    ctx.save();
    ctx.translate(18, (height - PADDING_BOTTOM + PADDING_TOP) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Yards', 0, 0);
    ctx.restore();
    ctx.restore();

    // Draw trajectory
    const draw = () => {
      if (frame >= trajectory.length) return;
      const pos = convert(trajectory[frame]);

      if (frame === 0) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      } else {
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = '#4f8cff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      frame += 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    frame = 0;
    animationRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animationRef.current);
  }, [trajectory, width, height, maxX, maxY, xTick, yTick]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export default FlightCanvas;
