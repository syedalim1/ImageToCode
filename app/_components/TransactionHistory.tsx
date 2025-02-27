"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  DollarSign,
  Zap,
  Search,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";

interface TransactionHistoryProps {
  onBuyCredits: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  onBuyCredits,
}) => {
  interface Transaction {
    id: number;
    userId: number;
    credits: number;
    amount: number;
    paymentId: string;
    orderId: string;
    signature: string;
    createdAt: string;
  }
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(
    null
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch("/api/user/transactions", {
          headers: {
            "x-user-email": user.email,
          },
        });
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, [user?.email]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(
      (transaction) =>
        transaction.paymentId
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        formatDate(transaction.createdAt)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const toggleTransactionDetails = (id: number) => {
    setExpandedTransaction(
      expandedTransaction === String(id) ? null : String(id)
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="transactionGrid"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#transactionGrid)" />
          </svg>
        </div>

        <motion.h2
          className="text-xl font-bold flex items-center relative z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Clock className="mr-2 h-5 w-5" />
          Transaction History
        </motion.h2>
        <motion.p
          className="text-blue-100 relative z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          View your past credit purchases and usage
        </motion.p>

        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            repeat: Infinity,
            repeatDelay: 5,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="p-6">
        {transactions.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            >
              <CreditCard className="h-10 w-10 text-gray-400" />
            </motion.div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No transactions yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Your transaction history will appear here once you make a
              purchase. Buy credits to start creating amazing designs!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onBuyCredits}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 px-6 py-2"
              >
                <Zap className="mr-2 h-4 w-4" />
                Buy Credits
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <>
            {/* Search and filter controls */}
            <motion.div
              className="mb-6 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSort}
                  className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Sort by Date
                  {sortDirection === "asc" ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </motion.button>
              </div>
            </motion.div>

            {/* Filter panel */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-medium text-gray-700 mb-3">
                    Filter Options
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Date Range
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>All time</option>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Status
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>All statuses</option>
                        <option>Completed</option>
                        <option>Pending</option>
                        <option>Failed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Amount
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>All amounts</option>
                        <option>Under ₹50</option>
                        <option>₹50 - ₹100</option>
                        <option>Over ₹100</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white mr-2"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Apply Filters
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-300"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="overflow-x-auto rounded-lg border border-gray-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      Transaction ID
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      Credits
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                      <motion.tr
                        variants={itemVariants}
                        className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${
                          expandedTransaction === transaction.id.toString()
                            ? "bg-blue-50"
                            : ""
                        }`}
                        onClick={() => toggleTransactionDetails(transaction.id)}
                      >
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {formatDate(transaction.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 font-mono">
                          {transaction.paymentId}
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-gray-700">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                            {formatPrice(transaction.amount)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">
                              {transaction.credits}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <motion.span
                            className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium inline-flex items-center"
                            whileHover={{ scale: 1.05 }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                            Completed
                          </motion.span>
                        </td>
                      </motion.tr>

                      {/* Expanded transaction details */}
                      <AnimatePresence>
                        {expandedTransaction === transaction.id.toString() && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td colSpan={5} className="bg-blue-50 px-4 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-500 mb-1">
                                    Payment Details
                                  </h4>
                                  <p className="text-sm text-gray-700">
                                    Method: Razorpay
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    Payment ID: {transaction.paymentId}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-500 mb-1">
                                    Package Details
                                  </h4>
                                  <p className="text-sm text-gray-700">
                                    Credits: {transaction.credits}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-xs font-semibold text-gray-500 mb-1">
                                    Receipt
                                  </h4>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download Receipt
                                  </motion.button>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Pagination */}
            <motion.div
              className="mt-6 flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium">
                  {filteredTransactions.length}
                </span>{" "}
                of <span className="font-medium">{transactions.length}</span>{" "}
                transactions
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" className="border-gray-300" disabled>
                  Previous
                </Button>
                <Button variant="outline" className="border-gray-300" disabled>
                  Next
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionHistory;
