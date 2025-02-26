"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, DollarSign, RefreshCw, Gift } from "lucide-react";

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

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  popular: boolean;
  color: string;
}

interface CreditPackagesProps {
  onPaymentSuccess: () => void;
}

const CreditPackages: React.FC<CreditPackagesProps> = ({ onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);

  // Credit packages
  const creditPackages: CreditPackage[] = [
    {
      id: "basic",
      name: "Basic",
      credits: 10,
      price: 2000, // ₹20
      popular: false,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "standard",
      name: "Standard",
      credits: 30,
      price: 6000, // ₹60
      originalPrice: 3000,
      discount: 17,
      popular: true,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "premium",
      name: "Premium",
      credits: 70,
      price: 14000, // ₹140
      originalPrice: 7500,
      discount: 33,
      popular: false,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      credits: 200,
      price: 40000, // ₹400
      originalPrice: 15000,
      discount: 33,
      popular: false,
      color: "from-amber-500 to-amber-600",
    },
  ];

  const handlePayment = async (pkg: CreditPackage) => {
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
            onPaymentSuccess();
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

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  return (
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
    </div>
  );
};

export default CreditPackages;
