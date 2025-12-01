"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

// --- TIPE DATA ---
type Position = {
  x: number;
  y: number;
};

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 20;
const TILE_SIZE = 20;
const INITIAL_SPEED = 200;

const getRandomFoodPosition = (): Position => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const InitialSnake: Position[] = [{ x: 10, y: 10 }];

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(InitialSnake);
  const [food, setFood] = useState<Position>(getRandomFoodPosition());
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    setSnake((prevSnake) => {
      const currentDirection = directionRef.current;
      const head = prevSnake[0];
      let newHead: Position;

      switch (currentDirection) {
        case "UP":
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case "DOWN":
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case "LEFT":
          newHead = { x: head.x - 1, y: head.y };
          break;
        case "RIGHT":
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      if (
        prevSnake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y
        )
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];
      let newFood = food;

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        newFood = getRandomFoodPosition();
        setFood(newFood);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver]);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(moveSnake, INITIAL_SPEED);

    return () => clearInterval(interval);
  }, [moveSnake, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (directionRef.current !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
        case "s":
          if (directionRef.current !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
          if (directionRef.current !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
          if (directionRef.current !== "LEFT") setDirection("RIGHT");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const resetGame = () => {
    setSnake(InitialSnake);
    setFood(getRandomFoodPosition());
    setDirection("RIGHT");
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🐍 React Snake Game</h1>
      <p>
        Score: <strong>{score}</strong>
      </p>

      {/* Area Game Board */}
      <div
        style={{
          width: GRID_SIZE * TILE_SIZE,
          height: GRID_SIZE * TILE_SIZE,
          border: "4px solid #333",
          position: "relative",
          backgroundColor: "#000",
        }}
      >
        {/* Render Ular */}
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              width: TILE_SIZE,
              height: TILE_SIZE,
              left: segment.x * TILE_SIZE,
              top: segment.y * TILE_SIZE,
              backgroundColor: index === 0 ? "lime" : "green", // Kepala dan tubuh
              borderRadius: index === 0 ? "3px" : "0",
            }}
          />
        ))}

        {/* Render Makanan */}
        <div
          style={{
            position: "absolute",
            width: TILE_SIZE,
            height: TILE_SIZE,
            left: food.x * TILE_SIZE,
            top: food.y * TILE_SIZE,
            backgroundColor: "red",
            borderRadius: "50%", // Bentuk bulat
          }}
        />

        {/* Layar Game Over */}
        {isGameOver && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "24px",
            }}
          >
            GAME OVER!
            <p>Final Score: {score}</p>
            <button
              onClick={resetGame}
              style={{
                padding: "10px 20px",
                marginTop: "20px",
                cursor: "pointer",
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <p style={{ marginTop: "15px" }}>
        Use **Arrow Keys** or **WASD** to move.
      </p>
    </div>
  );
}
