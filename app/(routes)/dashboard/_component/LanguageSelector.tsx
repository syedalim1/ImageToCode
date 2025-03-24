"use client";

import { languages } from "@/data/Constants";
import React, { useState, useEffect, useRef } from "react";

interface LanguageSelectorProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterText, setFilterText] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation for selection effect
  useEffect(() => {
    if (selectedLanguage) {
      setIsAnimating(true);
      setShowConfetti(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      const confettiTimer = setTimeout(() => setShowConfetti(false), 2000);
      return () => {
        clearTimeout(timer);
        clearTimeout(confettiTimer);
      };
    }
  }, [selectedLanguage]);

  // Filtered languages
  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(filterText.toLowerCase()) ||
      lang.description.toLowerCase().includes(filterText.toLowerCase())
  );

  // Get current language details
  const currentLanguage = languages.find((l) => l.id === selectedLanguage);

  // Function to generate confetti particles

  return (
    <div
      ref={containerRef}
      className="w-full h-full max-w-6xl mx-auto p-8 md:p-10 rounded-3xl bg-gradient-to-br from-purple-100/60 via-indigo-100/40 to-blue-100/60 dark:from-purple-900/30 dark:via-indigo-900/40 dark:to-blue-900/30 backdrop-blur-md shadow-2xl border border-white/30 dark:border-white/10 relative overflow-hidden"
    >
      {/* Dynamic background elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute top-40 left-1/4 w-40 h-40 bg-yellow-400/10 dark:bg-yellow-600/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-20 w-6 h-6 bg-purple-500/50 rounded-full animate-float"></div>
      <div
        className="absolute bottom-40 left-10 w-4 h-4 bg-indigo-500/50 rounded-full animate-float"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute top-1/2 right-10 w-8 h-8 bg-blue-500/50 rounded-md rotate-45 animate-float"
        style={{ animationDelay: "1.2s" }}
      ></div>

    

      {/* Main content container with z-index to stay above decorative elements */}
      <div className="relative z-10">
        {/* Header section with interactive elements */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text">
            Choose Your Tech Stack
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Select the technologies you want to use for your next amazing
            project
          </p>

       
        </div>

        {/* Languages display - grid or list view */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredLanguages.map((lang) => (
              <div
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                onMouseEnter={() => setHoveredLanguage(lang.id)}
                onMouseLeave={() => setHoveredLanguage(null)}
                className={`relative p-6 rounded-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 hover:shadow-xl ${
                  selectedLanguage === lang.id
                    ? "ring-2 ring-purple-500 dark:ring-purple-400 bg-gradient-to-br " +
                      lang.gradient
                    : "bg-white/60 dark:bg-gray-800/60 hover:bg-gradient-to-br " +
                      lang.hoverGradient
                }`}
              >
                {/* Card background with pattern */}
                <div className="absolute inset-0 rounded-2xl opacity-10 mix-blend-overlay overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                    }}
                  ></div>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
                </div>

                {/* Pulse animation when selected */}
                {selectedLanguage === lang.id && isAnimating && (
                  <div className="absolute inset-0 rounded-2xl bg-white/20 dark:bg-white/10 animate-pulse"></div>
                )}

            

                {/* Icon container with 3D effect */}
                <div className="flex items-center justify-center h-16 mb-4 transform transition-transform group-hover:scale-110">
                  <div className="relative p-3 rounded-full bg-gradient-to-br from-white/90 to-white/30 dark:from-gray-700/90 dark:to-gray-900/30 shadow-lg group-hover:shadow-xl transition-all">
                    {lang.icon}
                    {lang.secondaryIcon && (
                      <div className="absolute -bottom-2 -right-2 bg-white/90 dark:bg-gray-800/90 rounded-full p-1.5 shadow-md">
                        {lang.secondaryIcon}
                      </div>
                    )}

                    {/* Orbit effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-purple-300/30 dark:group-hover:border-purple-700/30 transition-all duration-500"></div>
                    <div className="absolute inset-[-8px] rounded-full border border-transparent group-hover:border-purple-300/20 dark:group-hover:border-purple-700/20 transition-all duration-700"></div>
                  </div>
                </div>

                {/* Language info */}
                <h3 className="text-xl font-bold text-center mb-2 text-gray-800 dark:text-white">
                  {lang.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center line-clamp-2">
                  {lang.description}
                </p>

            

                {/* Selection indicator */}
                {selectedLanguage === lang.id && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full p-1.5 shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 rounded-xl overflow-hidden">
            {filteredLanguages.map((lang) => (
              <div
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                onMouseEnter={() => setHoveredLanguage(lang.id)}
                onMouseLeave={() => setHoveredLanguage(null)}
                className={`flex items-center p-4 transition-all duration-300 cursor-pointer rounded-xl ${
                  selectedLanguage === lang.id
                    ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 dark:from-purple-500/30 dark:to-indigo-500/30 border-l-4 border-purple-500"
                    : "bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-700/80"
                }`}
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-white/90 to-white/30 dark:from-gray-700/90 dark:to-gray-900/30 shadow-md mr-4">
                  {lang.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      {lang.name}
                    </h3>
                   
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                    {lang.description}
                  </p>
                </div>
                {selectedLanguage === lang.id && (
                  <div className="ml-4 text-purple-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    

      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LanguageSelector;
