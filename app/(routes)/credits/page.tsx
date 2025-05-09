"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreditBalanceCard from "@/app/_components/CreditBalanceCard";
import TransactionHistory from "@/app/_components/TransactionHistory";
import { Zap, Clock } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import PricingSection from "@/app/_components/PricingSection";

// Sample transaction history
const transactions = [
  {
    id: "txn_123456",
    date: "2025-02-20T10:30:00Z",
    amount: 1000,
    credits: 10,
    status: "completed",
    createdAt: "2025-02-20T10:30:00Z",
  },
  {
    id: "txn_123457",
    date: "2025-02-15T14:20:00Z",
    amount: 2500,
    credits: 30,
    status: "completed",
    createdAt: "2025-02-15T14:20:00Z",
  },
  {
    id: "txn_123458",
    date: "2025-02-10T09:15:00Z",
    amount: 5000,
    credits: 75,
    status: "completed",
    createdAt: "2025-02-10T09:15:00Z",
  },
];

export default function CreditsPage() {

  const { user } = useUser();
  // console.log(user, "user");

  const [activeTab, setActiveTab] = useState<
    "packages" | "history" | "explainer"
  >("packages");



  const handleViewHistory = () => {
    setActiveTab("history");
  };

  const handleBuyCredits = () => {
    setActiveTab("packages");
  };

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
            className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-300 opacity-20 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 15,
              ease: "linear",
            }}
            className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-purple-300 opacity-20 blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent mb-4">
              Power Up Your Designs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purchase credits to generate more designs and unlock the full
              potential of our AI-powered code generation.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Credit Balance Card */}
      {user ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12">
          <CreditBalanceCard
            onViewHistory={handleViewHistory}
            onBuyCredits={handleBuyCredits}
          />
        </div>
      ) : null}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-md inline-flex">
            <motion.button
              onClick={() => setActiveTab("packages")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center ${activeTab === "packages"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="h-4 w-4 mr-1" />
              Credit Packages
            </motion.button>
            {user ? (
              <motion.button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center ${activeTab === "history"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Clock className="h-4 w-4 mr-1" />
                Transaction History
              </motion.button>
            ) : null}
          
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "packages" && (
            <motion.div
              key="packages"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <PricingSection  />
              
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <TransactionHistory
                transactions={transactions}
                onBuyCredits={handleBuyCredits}
              />
            </motion.div>
          )}

        
        </AnimatePresence>
      </div>
    </div>
  );
}
