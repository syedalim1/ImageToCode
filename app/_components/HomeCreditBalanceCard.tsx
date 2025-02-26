"use client";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface HomeCreditBalanceCardProps {
  balance: number;
}

const HomeCreditBalanceCard: React.FC<HomeCreditBalanceCardProps> = ({ balance }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-purple-100">Credit Balance</h3>
          <p className="text-3xl font-bold">{balance}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
          <SparklesIcon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="h-2 bg-white/20 rounded-full mb-2">
        <div 
          className="h-full bg-white rounded-full"
          style={{ width: `${Math.min(100, (balance / 100) * 100)}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-purple-100">
        <span>0</span>
        <span>100</span>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 w-full py-2 bg-white text-indigo-600 rounded-lg font-medium"
      >
        Buy More Credits
      </motion.button>
    </motion.div>
  );
};

export default HomeCreditBalanceCard;
