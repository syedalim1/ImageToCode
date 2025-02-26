"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { RefreshCw } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

interface CreditBalanceCardProps {
  onViewHistory: () => void;
  onBuyCredits: () => void;
}

const CreditBalanceCard: React.FC<CreditBalanceCardProps> = ({
  onViewHistory,
  onBuyCredits,
}) => {
  const [credits, setCredits] = useState<number>(0);
  const { user } = useUser();
  
  useEffect(() => {
    const fetchCredits = async () => {
      if (user && user?.emailAddresses) {
        try {
          const response = await axios.get(`/api/user?email=${user.emailAddresses[0].emailAddress}`);
          setCredits(response.data.credits);
        } catch (error) {
          console.error("Error fetching credits:", error);
        }
      }
    };

    fetchCredits();
  }, [user?.emailAddresses]);

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-10 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <CreditCard className="mr-2 h-6 w-6" />
              Your Credit Balance
            </h2>
            <p className="text-blue-100">
              Credits are used to generate designs. Each page requires 10
              credits to generate.
            </p>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <div className="text-5xl font-bold flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                >
                  <Zap className="mr-2 h-8 w-8 text-yellow-300" />
                </motion.div>
                <motion.span
                  key={credits}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {credits}
                </motion.span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              What you can do
            </h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">
                  Generate {Math.floor(credits / 10)} more pages
                </p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">Access all available AI models</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">
                  Edit and customize generated code
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Need more credits?
            </h3>
            <p className="text-gray-600 mb-4">
              Purchase additional credits to continue creating amazing designs
              with our AI.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={onBuyCredits}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Zap className="mr-2 h-4 w-4" />
                Buy Credits
              </Button>
              <Button
                variant="outline"
                onClick={onViewHistory}
                className="border-gray-300"
              >
                <Clock className="mr-2 h-4 w-4" />
                View History
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const response = await axios.post(
                      "/api/user/reset-credits"
                    );
                    alert(
                      `Success: ${response.data.updatedCount} users updated to have 100 credits.`
                    );
                    window.location.reload(); // Refresh the page to update the credit display
                  } catch (error) {
                    console.error("Error resetting credits:", error);
                    alert("Failed to reset credits. Please try again.");
                  }
                }}
                className="border-gray-300"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Credits
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreditBalanceCard;
