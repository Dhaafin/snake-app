"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

// --- TIPE DATA ---
type Position = {
  x: number;
  y: number;
};

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 20;
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
  const [showMobileTutorial, setShowMobileTutorial] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [tileSize, setTileSize] = useState(20);

  const directionRef = useRef(direction);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Calculate tile size based on screen width
  useEffect(() => {
    const calculateTileSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);

      // Calculate tile size to fit screen with some padding
      const padding = 40; // Total horizontal padding
      const maxWidth = width - padding;
      const calculatedTileSize = Math.floor(maxWidth / GRID_SIZE);

      // Set minimum and maximum tile sizes
      const minTileSize = 12;
      const maxTileSize = 25;
      const finalTileSize = Math.max(
        minTileSize,
        Math.min(maxTileSize, calculatedTileSize)
      );

      setTileSize(finalTileSize);
    };

    calculateTileSize();
    window.addEventListener("resize", calculateTileSize);

    return () => window.removeEventListener("resize", calculateTileSize);
  }, []);

  // Hide tutorial after 5 seconds on mobile
  useEffect(() => {
    if (isMobile && showMobileTutorial) {
      const timer = setTimeout(() => {
        setShowMobileTutorial(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isMobile, showMobileTutorial]);

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

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(getRandomFoodPosition());
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

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          if (directionRef.current !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          if (directionRef.current !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          if (directionRef.current !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          if (directionRef.current !== "LEFT") setDirection("RIGHT");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Touch/Swipe controls for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;

      // Hide tutorial on first touch
      if (showMobileTutorial) {
        setShowMobileTutorial(false);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;

      const minSwipeDistance = 30;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0 && directionRef.current !== "LEFT") {
            setDirection("RIGHT");
          } else if (deltaX < 0 && directionRef.current !== "RIGHT") {
            setDirection("LEFT");
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0 && directionRef.current !== "UP") {
            setDirection("DOWN");
          } else if (deltaY < 0 && directionRef.current !== "DOWN") {
            setDirection("UP");
          }
        }
      }

      touchStartX.current = 0;
      touchStartY.current = 0;
    };

    const container = gameContainerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);

      return () => {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [showMobileTutorial]);

  const resetGame = () => {
    setSnake(InitialSnake);
    setFood(getRandomFoodPosition());
    setDirection("RIGHT");
    setIsGameOver(false);
    setScore(0);
  };

  const boardSize = GRID_SIZE * tileSize;

  return (
    <div className="flex flex-col items-center w-full px-4 py-6">
      <style jsx>{`
        @keyframes neonPulse {
          0%,
          100% {
            text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
          }
          50% {
            text-shadow: 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff,
              0 0 50px #00ffff;
          }
        }

        @keyframes swipeArrow {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
          }
        }

        @keyframes swipeArrowVertical {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        .neon-text {
          color: #00ffff;
          animation: neonPulse 2s ease-in-out infinite;
        }

        .neon-border {
          box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff,
            inset 0 0 10px rgba(0, 255, 255, 0.2);
        }

        .snake-head {
          background: linear-gradient(135deg, #00ff88, #00ffff);
          box-shadow: 0 0 10px #00ffff, 0 0 15px #00ffff;
        }

        .snake-body {
          background: linear-gradient(135deg, #00cc66, #00aa88);
          box-shadow: 0 0 5px #00ffaa;
        }

        .food {
          background: radial-gradient(circle, #ff0080, #ff00ff);
          box-shadow: 0 0 15px #ff0080, 0 0 25px #ff0080;
        }

        .swipe-arrow {
          animation: swipeArrow 1.5s ease-in-out infinite;
        }

        .swipe-arrow-vertical {
          animation: swipeArrowVertical 1.5s ease-in-out infinite;
        }

        .tutorial-overlay {
          animation: fadeInOut 2s ease-in-out infinite;
        }
      `}</style>

      {/* Score Display */}
      <div className="mb-4 md:mb-6 text-center">
        <h1 className="text-2xl md:text-4xl font-black mb-2 neon-text">
          SCORE: {score}
        </h1>
      </div>

      {/* Game Container */}
      <div
        ref={gameContainerRef}
        className="relative touch-none select-none"
        style={{
          width: boardSize,
          height: boardSize,
          maxWidth: "100%",
        }}
      >
        {/* Game Board */}
        <div
          className="relative bg-black neon-border rounded-lg overflow-hidden"
          style={{
            width: boardSize,
            height: boardSize,
            border: "3px solid #00ffff",
          }}
        >
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: `${tileSize}px ${tileSize}px`,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className={index === 0 ? "snake-head" : "snake-body"}
              style={{
                position: "absolute",
                width: tileSize,
                height: tileSize,
                left: segment.x * tileSize,
                top: segment.y * tileSize,
                borderRadius: index === 0 ? "4px" : "2px",
                transition: "all 0.05s linear",
              }}
            />
          ))}

          {/* Food */}
          <div
            className="food"
            style={{
              position: "absolute",
              width: tileSize,
              height: tileSize,
              left: food.x * tileSize,
              top: food.y * tileSize,
              borderRadius: "50%",
            }}
          />

          {/* Mobile Tutorial Overlay */}
          {isMobile && showMobileTutorial && !isGameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center tutorial-overlay z-10">
              <div className="text-center text-cyan-400 p-4">
                <div className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 neon-text">
                  SWIPE TO MOVE
                </div>

                {/* Swipe Indicators */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-xs mx-auto">
                  <div />
                  <div className="flex flex-col items-center">
                    <div className="text-3xl md:text-4xl swipe-arrow-vertical">
                      ↑
                    </div>
                    <div className="text-xs mt-1 md:mt-2">UP</div>
                  </div>
                  <div />

                  <div className="flex items-center justify-center">
                    <div
                      className="text-3xl md:text-4xl swipe-arrow"
                      style={{ transform: "rotate(180deg)" }}
                    >
                      →
                    </div>
                    <div className="text-xs ml-1 md:ml-2">LEFT</div>
                  </div>
                  <div className="flex items-center justify-center text-xl md:text-2xl">
                    👆
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-xs mr-1 md:mr-2">RIGHT</div>
                    <div className="text-3xl md:text-4xl swipe-arrow">→</div>
                  </div>

                  <div />
                  <div className="flex flex-col items-center">
                    <div className="text-xs mb-1 md:mb-2">DOWN</div>
                    <div
                      className="text-3xl md:text-4xl swipe-arrow-vertical"
                      style={{ transform: "rotate(180deg)" }}
                    >
                      ↑
                    </div>
                  </div>
                  <div />
                </div>

                <div className="mt-4 md:mt-6 text-xs md:text-sm opacity-70">
                  Touch screen to dismiss
                </div>
              </div>
            </div>
          )}

          {/* Game Over Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 p-4">
              <div className="text-3xl md:text-6xl font-black mb-3 md:mb-4 text-pink-500 animate-pulse text-center">
                GAME OVER
              </div>
              <div className="text-xl md:text-3xl mb-4 md:mb-6 neon-text text-center">
                FINAL SCORE: {score}
              </div>
              <button
                onClick={resetGame}
                className="px-6 md:px-8 py-3 md:py-4 text-base md:text-xl font-bold bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-full hover:bg-cyan-400 hover:text-black transition-all duration-300 neon-border"
              >
                PLAY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Controls Info */}
      <div className="mt-4 md:mt-6 text-center px-4">
        {isMobile ? (
          <p className="text-cyan-300 text-xs md:text-base">
            <span className="font-bold text-pink-400">SWIPE</span> on screen to
            control the snake
          </p>
        ) : (
          <p className="text-cyan-300 text-sm md:text-base">
            Use <span className="font-bold text-pink-400">ARROW KEYS</span> or{" "}
            <span className="font-bold text-pink-400">WASD</span> to move
          </p>
        )}
      </div>
    </div>
  );
}
