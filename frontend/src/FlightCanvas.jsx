import React, { useRef, useEffect, useState } from 'react';

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
  const [phase, setPhase] = useState('swing'); // 'swing' or 'flight'

  // Padding for axes and labels
  const PADDING_LEFT = 50;
  const PADDING_BOTTOM = 40;
  const PADDING_TOP = 20;
  const PADDING_RIGHT = 20;

  // Find max values for scaling and ticks
  const maxX = Math.max(...trajectory.map((p) => p.x), 1);
  const maxY = Math.max(...trajectory.map((p) => p.y), 1);

  // Calculate scale so that 1 yard = same number of pixels on both axes
  const drawableWidth = width - PADDING_LEFT - PADDING_RIGHT;
  const drawableHeight = height - PADDING_TOP - PADDING_BOTTOM;
  const scale = Math.min(drawableWidth / maxX, drawableHeight / maxY);
  // Center the plot if there's extra space
  const xOffset = PADDING_LEFT + (drawableWidth - scale * maxX) / 2;
  const yOffset = PADDING_TOP + (drawableHeight - scale * maxY) / 2;

  // Helper to round up to a nice tick interval
  function niceTick(max, ticks = 5) {
    const raw = max / ticks;
    const pow10 = Math.pow(10, Math.floor(Math.log10(raw)));
    return Math.ceil(raw / pow10) * pow10;
  }
  const xTick = niceTick(maxX);
  const yTick = niceTick(maxY);

  // Convert world coords to canvas coords with equal scaling
  const convert = (pos) => {
    return {
      x: xOffset + pos.x * scale,
      y: height - PADDING_BOTTOM - (drawableHeight - scale * maxY) / 2 - pos.y * scale,
    };
  };

  // Draw stick figure golfer with a distinct club
  function drawGolfer(ctx, x, y, clubAngle = -Math.PI / 2) {
    ctx.save();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 3;
    // Head
    ctx.beginPath();
    ctx.arc(x, y - 18, 8, 0, 2 * Math.PI);
    ctx.stroke();
    // Body
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y + 18);
    ctx.stroke();
    // Left leg
    ctx.beginPath();
    ctx.moveTo(x, y + 18);
    ctx.lineTo(x - 10, y + 32);
    ctx.stroke();
    // Right leg
    ctx.beginPath();
    ctx.moveTo(x, y + 18);
    ctx.lineTo(x + 10, y + 32);
    ctx.stroke();
    // Left arm
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 12, y + 10);
    ctx.stroke();
    // Right arm (short, to hand)
    ctx.beginPath();
    ctx.moveTo(x, y);
    // Hand position for club
    const handX = x + 12 * Math.cos(clubAngle);
    const handY = y + 12 * Math.sin(clubAngle);
    ctx.lineTo(handX, handY);
    ctx.stroke();
    // Club (longer, brown)
    ctx.save();
    ctx.strokeStyle = '#8b5e3c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.lineTo(handX + 22 * Math.cos(clubAngle), handY + 22 * Math.sin(clubAngle));
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  }

  useEffect(() => {
    let frame = 0;
    let swingFrame = 0;
    const swingFrames = 40; // ~0.7s at 60fps
    const startPos = convert({ x: 0, y: 0 });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function drawAxesAndLabels() {
      // Axes
      ctx.save();
      ctx.strokeStyle = '#bfc9d1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(PADDING_LEFT, height - PADDING_BOTTOM);
      ctx.lineTo(width - PADDING_RIGHT, height - PADDING_BOTTOM);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(PADDING_LEFT, height - PADDING_BOTTOM);
      ctx.lineTo(PADDING_LEFT, PADDING_TOP);
      ctx.stroke();
      ctx.restore();
      // Ticks and labels
      ctx.save();
      ctx.font = '13px Arial';
      ctx.fillStyle = '#4a4e69';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
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
      ctx.textAlign = 'center';
      ctx.fillText('Yards', (width + PADDING_LEFT - PADDING_RIGHT) / 2, height - 5);
      ctx.save();
      ctx.translate(18, (height - PADDING_BOTTOM + PADDING_TOP) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText('Yards', 0, 0);
      ctx.restore();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.fillStyle = '#f6f7ff';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
      drawAxesAndLabels();
      if (phase === 'swing') {
        // Animate club angle
        const angle = -Math.PI / 2 + (swingFrame / swingFrames) * (Math.PI / 2 + 0.3);
        drawGolfer(ctx, startPos.x, startPos.y, angle);
        swingFrame++;
        if (swingFrame <= swingFrames) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setPhase('flight');
        }
      } else if (phase === 'flight') {
        // Draw golfer (static, club forward)
        drawGolfer(ctx, startPos.x, startPos.y, 0.3);
        // Draw trajectory
        if (frame > 0) {
          ctx.beginPath();
          for (let i = 0; i < frame; i++) {
            const pos = convert(trajectory[i]);
            if (i === 0) ctx.moveTo(pos.x, pos.y);
            else ctx.lineTo(pos.x, pos.y);
          }
          ctx.strokeStyle = '#4f8cff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        // Draw initial velocity vector for launch angle clarity
        if (trajectory.length > 1) {
          ctx.save();
          ctx.strokeStyle = '#ff9800';
          ctx.lineWidth = 2;
          ctx.beginPath();
          const p0 = convert(trajectory[0]);
          const p1 = convert(trajectory[1]);
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
          ctx.restore();
        }
        // Draw ball
        const pos = convert(trajectory[frame]);
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        frame += 1;
        if (frame < trajectory.length) {
          animationRef.current = requestAnimationFrame(animate);
        }
      }
    }

    setPhase('swing');
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [trajectory, width, height, maxX, maxY, xTick, yTick]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export default FlightCanvas;
