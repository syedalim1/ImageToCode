"use client";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface PricingCardProps {
  title: string;
  price: number;
  features: string[];
  popular: boolean;
  cta: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, popular, cta }) => {
  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      className={`rounded-2xl overflow-hidden ${
        popular
          ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl border-4 border-white"
          : "bg-white text-gray-800 border border-gray-200"
      }`}
    >
      {popular && (
        <div className="bg-indigo-700 text-white text-center py-2 text-sm font-semibold">
          MOST POPULAR
        </div>
      )}
      <div className="p-8">
        <h3 className={`text-2xl font-bold mb-4 ${popular ? "text-white" : "text-gray-800"}`}>
          {title}
        </h3>
        <div className="mb-6">
          <span className="text-4xl font-bold">${price}</span>
          <span className={`${popular ? "text-indigo-200" : "text-gray-500"}`}>/month</span>
        </div>
        <ul className="space-y-3 mb-8">
          {features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start">
              <CheckCircleIcon className={`h-5 w-5 mr-2 flex-shrink-0 ${
                popular ? "text-indigo-200" : "text-green-500"
              }`} />
              <span className={`${popular ? "text-indigo-100" : "text-gray-600"}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 rounded-lg font-semibold ${
            popular
              ? "bg-white text-indigo-600"
              : "bg-indigo-600 text-white"
          }`}
        >
          {cta}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PricingCard;
