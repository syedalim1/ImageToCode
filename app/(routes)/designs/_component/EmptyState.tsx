import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

function EmptyState({ hasSearchOrFilter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-10 text-center shadow-md"
    >
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
          <ImageIcon className="h-10 w-10 text-blue-400" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        No designs found
      </h2>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {hasSearchOrFilter
          ? "Try adjusting your search or filters to see more results."
          : "Create your first design to get started with AI-powered code generation."}
      </p>
      <Link href="/">
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all">
          Create New Design
        </Button>
      </Link>
    </motion.div>
  );
}

export default EmptyState;
