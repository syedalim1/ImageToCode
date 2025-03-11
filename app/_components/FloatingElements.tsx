"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";

const ELEMENT_COUNT = 15; // Reduced from 20 to 15 for better performance
const ELEMENT_COLORS = [
  [134, 166, 255], // Blue-ish
  [194, 166, 255], // Purple-ish
  [255, 166, 226], // Pink-ish
  [166, 255, 237], // Teal-ish
  [206, 255, 166], // Green-ish
];

// Pre-compute element properties for better performance
function generateElements(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const scale = Math.random() * 0.5 + 0.5;
    const randomColor = ELEMENT_COLORS[Math.floor(Math.random() * ELEMENT_COLORS.length)];
    
    return {
      id: i,
      initialX: Math.random() * 100 - 50 + "%",
      initialY: Math.random() * 100 - 50 + "%",
      scale,
      opacity: Math.random() * 0.3 + 0.1, // Reduced max opacity
      size: Math.random() * 80 + 20,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 5,
      color: `radial-gradient(circle, rgba(${randomColor[0]}, ${randomColor[1]}, ${randomColor[2]}, 0.2) 0%, rgba(${randomColor[0]}, ${randomColor[1]}, ${randomColor[2]}, 0) 70%)`,
      transform: "translateZ(0)" // Force GPU acceleration
    };
  });
}

const FloatingElements: React.FC = () => {
  // Memoize elements to prevent recalculation on each render
  const elements = useMemo(() => generateElements(ELEMENT_COUNT), []);
  
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ 
        willChange: "transform",
        transform: "translateZ(0)",
        contain: "content" 
      }}
    >
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full"
          initial={{
            x: element.initialX,
            y: element.initialY,
            scale: element.scale,
            opacity: element.opacity,
          }}
          animate={{
            y: ["-5%", "5%"],
            x: ["-2%", "2%"],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear", // Changed to linear for better performance
            delay: element.delay,
          }}
          style={{
            width: `${element.size}px`,
            height: `${element.size}px`,
            background: element.color,
            transform: element.transform,
            backfaceVisibility: "hidden" // Prevent flickering
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;
