"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

export const CreditHeader = () => {
  const { credits } = useAuthContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8"
    >
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <Zap className="h-8 w-8" />
        Credits & Transactions
      </h1>
      <p className="text-blue-100">
        Manage your credits and view transaction history
      </p>
    </motion.div>
  );
}; 