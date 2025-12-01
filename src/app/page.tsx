"use client";

import React, { useState, useEffect } from "react";
import { Zap, Trophy, Target } from "lucide-react";
import SnakeGame from "@/components/organism/snake";

export default function SnakeOnLanding() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 740);
    };
    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden relative">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transform: `translate(${mousePosition.x * 0.01}px, ${
              mousePosition.y * 0.01
            }px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      </div>

      {/* Glowing Orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div
        className="fixed bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-wider">
                <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                  SNAKE-ON
                </span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {!isGameStarted ? (
          // Hero Section
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <div className="mb-8 animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 blur-2xl opacity-50 animate-pulse" />
                <h2 className="relative text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4">
                  <span className="bg-gradient-to-r from-cyan-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    SNAKE
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
                    - ON
                  </span>
                </h2>
              </div>
            </div>

            <p className="text-lg md:text-xl text-cyan-200 mb-12 max-w-2xl leading-relaxed">
              Enter the neon grid. Master the snake. Dominate the leaderboard.
              <br />
              <span className="text-pink-400 font-bold">The game is on.</span>
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl">
              <div className="group p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30">
                <Target className="w-12 h-12 text-cyan-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-cyan-300 mb-2">
                  PRECISION
                </h3>
                <p className="text-sm text-gray-400">
                  Navigate with pixel-perfect accuracy
                </p>
              </div>

              <div className="group p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/30 hover:border-pink-400 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/30">
                <Zap className="w-12 h-12 text-pink-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-pink-300 mb-2">SPEED</h3>
                <p className="text-sm text-gray-400">
                  Lightning-fast reflexes required
                </p>
              </div>

              <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30">
                <Trophy className="w-12 h-12 text-purple-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-purple-300 mb-2">
                  VICTORY
                </h3>
                <p className="text-sm text-gray-400">
                  Claim your place in history
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setIsGameStarted(true)}
              className="group relative px-12 py-5 text-2xl md:text-3xl font-black tracking-wider overflow-hidden rounded-full transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500 animate-gradient" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 shadow-lg shadow-pink-500/50 group-hover:shadow-cyan-500/70 transition-shadow duration-300" />
              <span className="relative z-10 text-white drop-shadow-lg">
                START GAME
              </span>
            </button>

            <p className="mt-6 text-sm text-gray-500 animate-pulse">
              Press to enter the grid
            </p>
          </div>
        ) : (
          // Game Section
          <div className="flex flex-col items-center justify-center">
            <div className="mb-8">
              <button
                onClick={() => setIsGameStarted(false)}
                className="px-6 py-3 rounded-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 font-bold"
              >
                ← BACK TO MENU
              </button>
            </div>

            {/* Game Container with Neon Border */}
            <div className="relative p-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500 animate-gradient shadow-2xl shadow-cyan-500/50">
              <div className="bg-slate-950 rounded-xl p-6 md:p-8">
                <SnakeGame />
              </div>
            </div>

            {/* Game Controls Info */}
            <div className="mt-8 text-center">
              <p className="text-cyan-300 mb-2">
                <span className="font-bold text-pink-400">CONTROLS:</span>{" "}
                {isMobile ? (
                  <span>Use Swipe to Control</span>
                ) : (
                  <span>Use Arrow Keys or WASD</span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                Eat the glowing orbs • Avoid walls and yourself • Beat your high
                score
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto py-6 border-t border-cyan-500/20">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            Powered by <span className="text-cyan-400 font-bold">Dhaafin</span>{" "}
            • Built for champions
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
