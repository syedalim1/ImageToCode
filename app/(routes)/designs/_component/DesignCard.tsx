import React from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { DesignCardProps } from "./types";

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

function DesignCard({ design, index }: DesignCardProps) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/designs/${design.uid}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
          <img
            src={design.imageUrl}
            alt={design.description || "Design preview"}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute bottom-3 left-3 z-20">
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
              {design.model}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-xl mb-2 text-gray-800 line-clamp-1">
            {design.description || "Untitled Design"}
          </h3>

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(design.createdAt)}
            </span>

            <span className="text-blue-600 text-sm font-medium">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default DesignCard;
