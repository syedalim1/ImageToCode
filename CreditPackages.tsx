import { useState } from "react";
import { toast } from "react-toastify";

interface Package {
  price: number;
  credits: number;
}

interface PaymentDetails {
  orderId: string;
  paymentId: string;
  signature: string;
  status: string;
}

export default function CreditPackages() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  <svg width="100%" height="100%"></svg>;

  const handlePayment = async () => {
    if (!selectedPackage) {
      toast.error("Please select a package first");
      return;
    }

    try {
      // Create order
      const createOrderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedPackage.price,
          credits: selectedPackage.credits,
          // Add any other required order details
        }),
      });

      if (!createOrderResponse.ok) {
        const errorData = await createOrderResponse.json();
        console.error("Create order error:", errorData);
        throw new Error(
          `Failed to create order: ${
            errorData.message || createOrderResponse.status
          }`
        );
      }

      const orderData = await createOrderResponse.json();

      // Assuming you're using a payment gateway that returns payment details
      const paymentDetails = {
        orderId: orderData.orderId,
        paymentId: orderData.paymentId, // Make sure this matches what your payment gateway returns
        signature: orderData.signature, // If using digital signature for verification
        status: "success", // Or whatever status your payment gateway returns
      };

      // Verify payment
      const verifyResponse = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDetails),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        console.error("Verify payment error:", errorData);
        toast.error("Payment verification failed. Please contact support.");
        throw new Error(
          `Failed to verify payment: ${
            errorData.message || verifyResponse.status
          }`
        );
      }

      const verificationResult = await verifyResponse.json();

      if (verificationResult.success) {
        toast.success("Payment successful! Credits added to your account.");
        // Update UI or redirect user
      } else {
        toast.error("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        "An error occurred during payment processing. Please try again."
      );
    }
  };
}
