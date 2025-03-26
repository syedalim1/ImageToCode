"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import ClientOnly from "./ClientOnly";

interface SuccessConfettiProps {
  trigger: boolean;
  duration?: number;
}

export default function SuccessConfetti({ 
  trigger, 
  duration = 3000 
}: SuccessConfettiProps) {
  useEffect(() => {
    if (!trigger) return;
    
    const animationEndTime = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEndTime - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0, 0.2) },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0, 0.2) },
      });
    }, 250);

    return () => clearInterval(interval);
  }, [trigger, duration]);

  // This component doesn't render anything visible
  return null;
}
