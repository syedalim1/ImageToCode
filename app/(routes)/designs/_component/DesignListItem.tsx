import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DesignListItemProps } from "./types";

interface Design {
  id: number;
  uid: string;
  model: string;
  imageUrl: string;
  code: { content: string };
  description: string | null;
  email: string | null;
  createdAt: string;
  options: string[];
}

function DesignListItem({ design, index }: DesignListItemProps) {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
    >
      <Link href={`/designs/${design.uid}`} className="block">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-48 h-40">
            <img
              src={design.imageUrl}
              alt={design.description || "Design preview"}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                {design.model}
              </span>
            </div>
          </div>

          <div className="p-5 flex-grow">
            <h3 className="font-bold text-xl mb-2 text-gray-800">
              {design.description || "Untitled Design"}
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-2">
              A design created with {design.model} on{" "}
              {formatDate(design.createdAt)}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                UID: {design.uid.substring(0, 8)}...
              </span>

              <span className="text-blue-600 text-sm font-medium">
                View Details →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default DesignListItem;
