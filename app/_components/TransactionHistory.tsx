"use client";

import React from "react";
import { Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  credits: number;
  status: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onBuyCredits: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, onBuyCredits }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { // Explicitly set locale to "en-US"
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

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <h2 className="text-xl font-bold flex items-center">
          Transaction History
        </h2>
        <p className="text-blue-100">
          View your past credit purchases and usage
        </p>
      </div>

      <div className="p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No transactions yet
            </h3>
            <p className="text-gray-500 mb-4">
              Your transaction history will appear here once you make a
              purchase.
            </p>
            <Button
              onClick={onBuyCredits}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Buy Credits
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
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
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {transaction.id}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {formatPrice(transaction.amount)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {transaction.credits}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
