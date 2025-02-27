"use client";

import { motion, AnimatePresence } from "framer-motion";
import CreditPackages from "@/app/_components/CreditPackages";
import TransactionHistory from "@/app/_components/TransactionHistory";
import CreditSystemExplainer from "@/app/_components/CreditSystemExplainer";

interface TabContentProps {
  activeTab: "packages" | "history" | "explainer";
  transactions: Array<{
    id: string;
    date: string;
    amount: number;
    credits: number;
    status: string;
    createdAt: string;
  }>;
  handlePaymentSuccess: () => void;
  handleBuyCredits: () => void;
}

export const TabContent = ({
  activeTab,
  transactions,
  handlePaymentSuccess,
  handleBuyCredits,
}: TabContentProps) => {
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {activeTab === "packages" && (
        <motion.div
          key="packages"
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <CreditPackages onPaymentSuccess={handlePaymentSuccess} />
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
      
      {activeTab === "explainer" && (
        <motion.div
          key="explainer"
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <CreditSystemExplainer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 