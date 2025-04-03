"use client";

import { db } from "@/configs/db";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface ModeSelectorProps {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
}



const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  setSelectedMode,
}) => {
  const { user } = useUser();
  const [userCredits, setUserCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserCredits = async () => {
      if (user?.primaryEmailAddress) {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/user?email=${user.primaryEmailAddress.emailAddress}`);
          setUserCredits(response.data.credits);
        } catch (error) {
          console.error("Error fetching user credits:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      fetchUserCredits();
    }
  }, [user]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl p-6 shadow-xl border-2 border-purple-300 relative overflow-hidden bg-gradient-to-br from-white to-purple-50"
    >
  
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-4">
          <motion.h2 
            className="sm:text-2xl font-bold text-indigo-800 flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <svg
              className="w-7 h-7 mr-2 text-indigo-600 filter drop-shadow-md"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Select Mode
          </motion.h2>
          
          {/* Credits display button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <motion.button
              className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              animate={{ 
                boxShadow: ['0 4px 6px rgba(99, 102, 241, 0.3)', '0 8px 12px rgba(99, 102, 241, 0.5)', '0 4px 6px rgba(99, 102, 241, 0.3)'] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg 
                className="w-5 h-5 mr-2 text-yellow-200" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
                <path d="M10 4a1 1 0 100 2 1 1 0 000-2zm0 10a1 1 0 100 2 1 1 0 000-2z"/>
                <path fillRule="evenodd" d="M10 6a1 1 0 011 1v4a1 1 0 01-2 0V7a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              {isLoading ? (
                <span className="flex items-center">
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-white mx-1"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-white mx-1"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-white mx-1"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                  />
                </span>
              ) : (
                <>
                  <span className="mr-1">{userCredits}</span>
                  <span>Credits Available</span>
                </>
              )}
            </motion.button>
            {/* Decorative elements around credit button */}
            <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-yellow-300 animate-ping opacity-75"></div>
            <div className="absolute -left-2 -bottom-2 w-3 h-3 rounded-full bg-green-300 animate-pulse"></div>
          </motion.div>
        </div>

        <motion.p 
          className="text-indigo-700 mb-6 pl-9 text-sm sm:font-medium"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Choose the perfect mode for your code generation
          <motion.span 
            className="inline-block ml-1"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >✨</motion.span>
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Normal Mode Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative p-5 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group ${
              selectedMode === "normal"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 hover:bg-blue-50 border border-blue-200 hover:shadow-md"
            }`}
            onClick={() => setSelectedMode("normal")}
          >
          
            <input
              type="radio"
              id="normal"
              value="normal"
              checked={selectedMode === "normal"}
              onChange={() => setSelectedMode("normal")}
              className="absolute opacity-0"
            />
            <label
              htmlFor="normal"
              className="flex items-center cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
                  selectedMode === "normal"
                    ? "bg-white shadow-inner"
                    : "border-2 border-indigo-400"
                }`}
              >
                {selectedMode === "normal" && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-4 h-4 rounded-full bg-indigo-600"
                  ></motion.div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold sm:text-lg text-sm flex items-center">
                  <span>Normal Mode</span>
                  <svg
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 7L18 12M18 12L13 17M18 12H6"
                      stroke={selectedMode === "normal" ? "white" : "#6366F1"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className={`text-sm mt-1 ${
                    selectedMode === "normal"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke={selectedMode === "normal" ? "white" : "#6366F1"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    10 Credits
                  </span>
                </div>
              </div>
            </label>

            {/* Feature List */}
            <div
              className={`mt-4 pl-11 ${
                selectedMode === "normal" ? "text-blue-100" : "text-gray-600"
              }`}
            >
              <div className="flex items-center text-sm mb-1">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13L9 17L19 7"
                    stroke={selectedMode === "normal" ? "white" : "#818CF8"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Standard code generation</span>
              </div>
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13L9 17L19 7"
                    stroke={selectedMode === "normal" ? "white" : "#818CF8"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Basic documentation</span>
              </div>
            </div>

            {selectedMode === "normal" && (
              <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-300 to-yellow-500 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full shadow-md"
              >
                BASIC
              </motion.div>
            )}
          </motion.div>

          {/* Export Mode Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative p-5 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden group ${
              selectedMode === "export"
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 hover:bg-purple-50 border border-purple-200 hover:shadow-md"
            }`}
            onClick={() => setSelectedMode("export")}
          >
         
            <input
              type="radio"
              id="export"
              value="export"
              checked={selectedMode === "export"}
              onChange={() => setSelectedMode("export")}
              className="absolute opacity-0"
            />
            <label
              htmlFor="export"
              className="flex items-center cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
                  selectedMode === "export"
                    ? "bg-white shadow-inner"
                    : "border-2 border-purple-400"
                }`}
              >
                {selectedMode === "export" && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-4 h-4 rounded-full bg-purple-600"
                  ></motion.div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold sm:text-lg text-sm flex items-center">
                  <span>Export Mode</span>
                  <svg
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4V20M12 4L6 10M12 4L18 10"
                      stroke={selectedMode === "export" ? "white" : "#9333EA"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  className={`text-sm mt-1 ${
                    selectedMode === "export"
                      ? "text-pink-100"
                      : "text-gray-500"
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke={selectedMode === "export" ? "white" : "#9333EA"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    30 Credits
                  </span>
                </div>
              </div>
            </label>

            {/* Feature List */}
            <div
              className={`mt-4 pl-11 ${
                selectedMode === "export" ? "text-pink-100" : "text-gray-600"
              }`}
            >
              <div className="flex items-center text-sm mb-1">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13L9 17L19 7"
                    stroke={selectedMode === "export" ? "white" : "#C084FC"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Advanced export options</span>
              </div>
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13L9 17L19 7"
                    stroke={selectedMode === "export" ? "white" : "#C084FC"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Premium features</span>
              </div>
            </div>

            {selectedMode === "export" && (
              <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-300 to-yellow-500 text-purple-900 text-xs font-bold px-3 py-1 rounded-full shadow-md"
              >
                PREMIUM
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Decorative footer with improved styling */}
      <div className="mt-6 pt-4 border-t border-purple-200 flex justify-between items-center text-xs text-indigo-500 font-medium relative">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Current balance: {isLoading ? '...' : userCredits} credits</span>
        </div>

        {/* Subtle loading animation */}
        <div className="flex space-x-1">
          <div className="w-1 h-1 rounded-full bg-indigo-300 opacity-75"></div>
          <div className="w-1 h-1 rounded-full bg-indigo-400 opacity-75"></div>
          <div className="w-1 h-1 rounded-full bg-indigo-500 opacity-75"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModeSelector;