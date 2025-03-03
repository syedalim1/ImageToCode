// File: DemoPreview.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DemoPreview({
  animateHero,
  codeExample,
  AnimatedCodeSnippet,
}) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const isMobile = windowWidth < 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Enhanced color palette
  const gradients = {
    header: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500",
    button: "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600",
    badge: "bg-gradient-to-r from-cyan-400 to-blue-500",
    codePane: "bg-gradient-to-b from-gray-900 to-gray-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
      className="mt-12 md:mt-24 rounded-3xl shadow-2xl overflow-hidden border-8 border-white dark:border-gray-800 mx-auto max-w-5xl relative"
      style={{
        willChange: "transform",
        boxShadow:
          "0 10px 50px -12px rgba(0, 0, 0, 0.25), 0 0 100px -20px rgba(94, 84, 243, 0.3)",
      }}
    >
      {/* Enhanced Mac-style window controls */}
      <div
        className={`${gradients.header} p-3 md:p-4 flex items-center justify-between`}
      >
        <div className="flex space-x-2">
          <div className="h-2.5 md:h-3 w-2.5 md:w-3 rounded-full bg-red-500 shadow-inner flex items-center justify-center">
            <div className="h-1 w-1 rounded-full bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="h-2.5 md:h-3 w-2.5 md:w-3 rounded-full bg-yellow-500 shadow-inner"></div>
          <div className="h-2.5 md:h-3 w-2.5 md:w-3 rounded-full bg-green-500 shadow-inner"></div>
        </div>
        <div className="text-white text-xs font-mono ml-4 opacity-80 flex items-center">
          <svg
            className="w-3.5 h-3.5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          design-to-code-converter.app
        </div>
        <div className="flex space-x-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="hidden md:flex h-6 px-2 rounded-full bg-white/20 items-center backdrop-blur-sm text-white text-xs"
          >
            <span className="text-xs">✨ Pro</span>
          </motion.div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-900 to-gray-950 p-4 md:p-8 h-72 md:h-96 flex items-center justify-center relative overflow-hidden">
        {/* Interactive background grid */}
        <div className="absolute inset-0 w-full h-full z-0">
          <svg
            className="absolute w-full h-full opacity-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient
                id="grid-gradient"
                cx="50%"
                cy="50%"
                r="50%"
                fx="50%"
                fy="50%"
              >
                <stop offset="0%" stopColor="rgba(156, 39, 176, 0.3)" />
                <stop offset="100%" stopColor="rgba(156, 39, 176, 0)" />
              </radialGradient>
            </defs>
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={i * 10}
                  x2="100"
                  y2={i * 10}
                  stroke="rgba(255,255,255,0.1)"
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 10}
                  y1="0"
                  x2={i * 10}
                  y2="100"
                  stroke="rgba(255,255,255,0.1)"
                />
              ))}
              <rect width="100" height="100" fill="url(#grid-gradient)" />
            </motion.g>
          </svg>
        </div>

        {/* Enhanced split view animation with better visuals */}
        <div className="absolute inset-0 flex flex-col md:flex-row z-10">
          <motion.div
            initial={{ width: "100%", height: isMobile ? "50%" : "100%" }}
            animate={{
              width: animateHero ? (isMobile ? "100%" : "50%") : "100%",
              height: animateHero ? (isMobile ? "50%" : "100%") : "100%",
            }}
            transition={{ delay: 1.2, duration: 1.2, ease: "easeInOut" }}
            className="h-full md:h-full bg-cover bg-center border-b md:border-b-0 md:border-r border-gray-700/50 relative"
            style={{
              backgroundImage:
                "url('https://placehold.co/800x600/667eea/ffffff?text=UI+Design')",
              willChange: "transform",
              transform: "translate3d(0,0,0)",
            }}
          >
            {animateHero && (
              <>
                <div className="absolute inset-0 bg-black/30"></div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                  className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center shadow-lg"
                  style={{ willChange: "transform" }}
                >
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 shadow-[0_0_10px_rgba(52,211,153,0.7)]"></span>
                  Design Input
                </motion.div>

                {/* Enhanced animated scan effect */}
                <motion.div
                  initial={{ top: 0, opacity: 0 }}
                  animate={{
                    top: ["0%", "100%", "0%"],
                    opacity: [0.9, 0.9, 0],
                  }}
                  transition={{
                    duration: 3,
                    times: [0, 0.5, 1],
                    delay: 2.2,
                    repeat: 1,
                  }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_10px_rgba(79,70,229,0.7)]"
                  style={{ willChange: "transform" }}
                ></motion.div>

                {/* Design elements */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.5, duration: 0.7 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-4/5 h-4/5 flex flex-col items-center justify-center">
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-blue-400 opacity-60"></div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-blue-400 opacity-60"></div>
                    {/* Add UI design elements here */}
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ width: "0%", height: "0%" }}
            animate={{
              width: animateHero ? (isMobile ? "100%" : "50%") : "0%",
              height: animateHero ? (isMobile ? "50%" : "100%") : "0%",
            }}
            transition={{ delay: 1.2, duration: 1.2, ease: "easeInOut" }}
            className={`${gradients.codePane} overflow-hidden relative`}
            style={{ willChange: "transform" }}
          >
            {animateHero && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                  className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center shadow-lg"
                  style={{ willChange: "transform" }}
                >
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 shadow-[0_0_10px_rgba(167,139,250,0.7)]"></span>
                  Generated Code
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.8 }}
                  className="p-4 h-full overflow-y-auto"
                  style={{ willChange: "transform" }}
                >
                  <AnimatedCodeSnippet code={codeExample} />
                </motion.div>

                {/* Floating code particles */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: Math.random() * 100 - 50,
                      y: Math.random() * 100 - 50,
                      opacity: 0,
                    }}
                    animate={{
                      y: [Math.random() * 100, Math.random() * -100],
                      opacity: [0, 0.7, 0],
                      rotate: Math.random() > 0.5 ? 10 : -10,
                    }}
                    transition={{
                      duration: 10 + Math.random() * 5,
                      repeat: Infinity,
                      delay: i * 0.5 + 2.5,
                    }}
                    className="absolute text-xs font-mono text-blue-300 opacity-30 whitespace-nowrap"
                    style={{ fontSize: 8 + Math.random() * 4 }}
                  >
                    {
                      [
                        "&lt;div className='flex'&gt;",
                        "const [state, setState] = useState();",
                        "transform: translate3d(0,0,0);",
                        "@keyframes float { 0% { ... } }",
                        "&lt;Button variant='primary' /&gt;",
                      ][i]
                    }
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        </div>

        {!animateHero && (
          <div className="relative z-20 bg-black/70 backdrop-blur-xl px-6 py-5 md:px-8 md:py-6 rounded-xl shadow-2xl border border-gray-700/50">
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 md:h-6 md:w-6 text-purple-500 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-100 font-medium text-sm md:text-base">
                AI Processing Your Design...
              </span>
            </div>

            <div className="mt-3 w-full bg-gray-700/50 h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                initial={{ width: "0%" }}
                animate={{ width: "75%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{
                  willChange: "transform",
                  boxShadow: "0 0 10px rgba(168, 85, 247, 0.5)",
                }}
              ></motion.div>
            </div>

            <motion.div
              className="flex justify-center mt-4 space-x-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-xs text-gray-400">Analyzing structure</div>
              <div className="text-xs text-gray-400">•</div>
              <div className="text-xs text-purple-400 font-medium">
                Generating code
              </div>
              <div className="text-xs text-gray-400">•</div>
              <div className="text-xs text-gray-400">Optimizing</div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Enhanced tech badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute -bottom-5 md:-bottom-6 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-2"
        style={{ willChange: "transform" }}
      >
        {[
          { name: "React", icon: "⚛️" },
          { name: "Tailwind", icon: "🌊" },
          { name: "Vue", icon: "🟢" },
          { name: "Angular", icon: "🔺" },
          { name: "Svelte", icon: "🔥" },
        ].map((tech, i) => (
          <motion.div
            key={tech.name}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
              scale: 1.05,
            }}
            transition={{
              delay: 2.5 + i * 0.1,
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
            className={`${
              i % 2 === 0 ? gradients.badge : "bg-white dark:bg-gray-800"
            } px-3 py-1.5 rounded-full text-xs font-medium shadow-lg ${
              i % 2 === 0 ? "text-white" : "text-gray-700 dark:text-gray-200"
            } border border-gray-200/10 dark:border-gray-700/50 flex items-center`}
            style={{ willChange: "transform" }}
          >
            <span className="mr-1.5">{tech.icon}</span>
            {tech.name}
          </motion.div>
        ))}
      </motion.div>

      {/* Feature highlight badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animateHero ? 1 : 0 }}
        transition={{ delay: 3, duration: 0.5 }}
        className="absolute right-4 top-20 transform -translate-y-1/2 hidden lg:block"
      >
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 3.2, duration: 0.5 }}
          className="bg-pink-500/20 backdrop-blur-sm border border-pink-500/30 text-pink-300 rounded-lg p-2 mb-3 text-xs flex items-center shadow-lg"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Instant Conversion
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 3.4, duration: 0.5 }}
          className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 rounded-lg p-2 text-xs flex items-center shadow-lg"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Multiple Frameworks
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
