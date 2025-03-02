"use client";
import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function PricingCard({
  title,
  price,
  originalPrice,
  credits,
  features,
  popular,
  cta,
  save,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: title === "Standard" ? 0.1 : title === "Premium" ? 0.2 : 0,
      }}
      whileHover={{ y: -10 }}
      className={`rounded-2xl overflow-hidden border ${
        popular ? "border-purple-500 shadow-xl" : "border-gray-200 shadow"
      } bg-white relative`}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 rounded-bl-lg text-xs font-bold">
          MOST POPULAR
        </div>
      )}
      {save && (
        <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 rounded-br-lg text-xs font-bold">
          {save}
        </div>
      )}
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <div className="mb-6">
          {originalPrice && (
            <span className="text-gray-400 line-through mr-2">
              ${originalPrice}
            </span>
          )}
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-gray-500 ml-1">/month</span>
        </div>
        <div className="text-purple-600 font-semibold mb-6 bg-purple-100 rounded-full py-2 px-4 inline-block">
          {credits}
        </div>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 rounded-lg font-bold  ${
            popular
              ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {cta}
        </motion.button>
      </div>
    </motion.div>
  );
}
