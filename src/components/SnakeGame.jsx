import React, { useEffect, useState, useRef } from "react";

const GRID = 20;
const SIZE = 20;

export default function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState({ x: 10, y: 10 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [running, setRunning] = useState(true);

  const canvasRef = useRef(null);

  // game loop
  useEffect(() => {
    if (!running) return;

    const loop = setInterval(() => {
      setSnake((prev) => {
        const head = {
          x: prev[0].x + dir.x,
          y: prev[0].y + dir.y,
        };

        // wall
        if (head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID) {
          setRunning(false);
          return prev;
        }

        // self
        if (prev.some(p => p.x === head.x && p.y === head.y)) {
          setRunning(false);
          return prev;
        }

        let newSnake = [head, ...prev];

        if (head.x === food.x && head.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * GRID),
            y: Math.floor(Math.random() * GRID),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120);

    return () => clearInterval(loop);
  }, [dir, running, food]);

  // draw
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = "lime";
    snake.forEach(p => {
      ctx.fillRect(p.x * SIZE, p.y * SIZE, SIZE, SIZE);
    });

    ctx.fillStyle = "red";
    ctx.fillRect(food.x * SIZE, food.y * SIZE, SIZE, SIZE);
  }, [snake, food]);

  // control
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "ArrowUp") setDir(d => d.y === 0 ? { x: 0, y: -1 } : d);
      if (e.key === "ArrowDown") setDir(d => d.y === 0 ? { x: 0, y: 1 } : d);
      if (e.key === "ArrowLeft") setDir(d => d.x === 0 ? { x: -1, y: 0 } : d);
      if (e.key === "ArrowRight") setDir(d => d.x === 0 ? { x: 1, y: 0 } : d);
    };

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Snake Game</h2>

      <canvas ref={canvasRef} width={400} height={400} />

      {!running && <h3>Game Over</h3>}
    </div>
  );
}
