"use client";

import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
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
import { Button } from "@/components/ui/button";

export default function CreditsPage() {
  const { credits } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 1000 }), // 1000 = ₹10
      });
      
      const order = await res.json();
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Your App Name",
        description: "Credits Purchase",
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          // Verify payment
          const verificationRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });
          
          if (verificationRes.ok) {
            // Update user credits
            // You can add your logic here
            alert("Payment successful!");
          } else {
            alert("Payment verification failed");
          }
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buy Credits</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Credits</h2>
          <span className="text-lg font-medium">{credits}</span>
        </div>
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Credits Package</h2>
          <p className="text-gray-600 mb-4">₹10 for 100 credits</p>
          <Button onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Buy Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
