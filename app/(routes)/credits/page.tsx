"use client";

import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CreditCard,
  Zap,
  Gift,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Shield,
  RefreshCw,
  DollarSign,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function CreditsPage() {
  const { credits } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"packages" | "history">(
    "packages"
  );

  // Credit packages
  const creditPackages = [
    {
      id: "basic",
      name: "Basic",
      credits: 10,
      price: 1000, // ₹10
      popular: false,

      color: "from-blue-500 to-blue-600",
    },
    {
      id: "standard",
      name: "Standard",
      credits: 30,
      price: 2500, // ₹25
      originalPrice: 3000,
      discount: 17,
      popular: true,

      color: "from-purple-500 to-purple-600",
    },
    {
      id: "premium",
      name: "Premium",
      credits: 70,
      price: 5000, // ₹50
      originalPrice: 7500,
      discount: 33,
      popular: false,

      color: "from-pink-500 to-pink-600",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      credits: 200,
      price: 10000, // ₹100
      originalPrice: 15000,
      discount: 33,
      popular: false,

      color: "from-amber-500 to-amber-600",
    },
  ];

  // Sample transaction history
  const transactions = [
    {
      id: "txn_123456",
      date: "2025-02-20T10:30:00Z",
      amount: 1000,
      credits: 10,
      status: "completed",
    },
    {
      id: "txn_123457",
      date: "2025-02-15T14:20:00Z",
      amount: 2500,
      credits: 30,
      status: "completed",
    },
    {
      id: "txn_123458",
      date: "2025-02-10T09:15:00Z",
      amount: 5000,
      credits: 75,
      status: "completed",
    },
  ];

  const handlePayment = async (pkg: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: pkg.price }), // amount in paise
      });

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Img2Code",
        description: `${pkg.name} Credits Package`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          // Verify payment
          const verificationRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...response,
              packageId: pkg.id,
              credits: pkg.credits,
            }),
          });

          if (verificationRes.ok) {
            // Show success message
            alert(
              `Payment successful! ${pkg.credits} credits added to your account.`
            );
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#6366F1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12">
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
                    <p className="text-gray-600">
                      Access all available AI models
                    </p>
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
                  Purchase additional credits to continue creating amazing
                  designs with our AI.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() =>
                      document
                        .getElementById("packages")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Buy Credits
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("history")}
                    className="border-gray-300"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    View History
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await axios.post('/api/user/reset-credits');
                        alert(`Success: ${response.data.updatedCount} users updated to have 100 credits.`);
                        window.location.reload(); // Refresh the page to update the credit display
                      } catch (error) {
                        console.error('Error resetting credits:', error);
                        alert('Failed to reset credits. Please try again.');
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-md inline-flex">
            <button
              onClick={() => setActiveTab("packages")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === "packages"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Credit Packages
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Transaction History
            </button>
          </div>
        </div>

        {activeTab === "packages" ? (
          <div id="packages">
            {/* Special Offer Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 mb-8 shadow-lg text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0">
                <svg
                  width="150"
                  height="150"
                  viewBox="0 0 150 150"
                  className="text-yellow-300 opacity-20"
                >
                  <path d="M0 0L150 150V0H0Z" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="mr-4">
                    <Gift className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Special Offer!</h3>
                    <p>Get up to 33% off on Premium and Enterprise packages</p>
                  </div>
                </div>
                <div>
                  <Button className="bg-white text-orange-500 hover:bg-gray-100">
                    Claim Offer
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Credit Packages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {creditPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden relative ${
                    pkg.popular ? "ring-2 ring-purple-500" : ""
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-md">
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  {pkg.discount && (
                    <div className="absolute top-0 left-0">
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-md">
                        SAVE {pkg.discount}%
                      </div>
                    </div>
                  )}

                  <div
                    className={`bg-gradient-to-r ${pkg.color} p-6 text-white`}
                  >
                    <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">
                        {formatPrice(pkg.price)}
                      </span>
                      {pkg.originalPrice && (
                        <span className="ml-2 text-sm line-through opacity-70">
                          {formatPrice(pkg.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-2xl font-bold text-gray-800">
                        {pkg.credits} Credits
                      </span>
                    </div>

                    <Button
                      onClick={() => handlePayment(pkg)}
                      disabled={loading}
                      className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white`}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Buy Now
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold text-center mb-10 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Why Purchase Credits?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800">
                    Boost Productivity
                  </h3>
                  <p className="text-gray-600">
                    Generate more designs faster and streamline your development
                    workflow.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800">
                    Premium Features
                  </h3>
                  <p className="text-gray-600">
                    Unlock advanced models and features for more accurate code
                    generation.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800">
                    Priority Support
                  </h3>
                  <p className="text-gray-600">
                    Get faster responses and dedicated assistance for your
                    projects.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div>
            {/* Transaction History */}
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
                      onClick={() => setActiveTab("packages")}
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
          </div>
        )}
      </div>
    </div>
  );
}
